const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Configure multer for file uploads with UTF-8 support
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        // Properly decode UTF-8 filename from multipart form data
        try {
            // The filename comes as latin1 encoded, convert to UTF-8
            const decodedName = Buffer.from(file.originalname, 'latin1').toString('utf8');
            file.originalname = decodedName;
        } catch (e) {
            console.error('Error decoding filename:', e);
        }
        cb(null, true);
    }
});

// Upload document
router.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, department_id, category_id } = req.body;

    if (!title || !department_id || !category_id) {
        fs.unlinkSync(req.file.path); // Delete uploaded file
        return res.status(400).json({ error: 'Title, department, and category required' });
    }

    // Use the decoded filename from fileFilter
    const filename = req.file.originalname;

    db.run(
        'INSERT INTO documents (title, filename, path, department_id, category_id, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)',
        [title, filename, req.file.path, department_id, category_id, req.user.id],
        function (err) {
            if (err) {
                fs.unlinkSync(req.file.path);
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({
                message: 'Document uploaded successfully',
                documentId: this.lastID,
                filename: filename
            });
        }
    );
});

// Get all documents (with optional filters)
router.get('/', authenticateToken, (req, res) => {
    const { department_id, category_id, search } = req.query;

    let query = `
        SELECT d.*, dept.name as department_name, cat.name as category_name, u.username as uploaded_by_name
        FROM documents d
        JOIN departments dept ON d.department_id = dept.id
        JOIN categories cat ON d.category_id = cat.id
        JOIN users u ON d.uploaded_by = u.id
        WHERE 1=1
    `;
    const params = [];

    if (department_id) {
        query += ' AND d.department_id = ?';
        params.push(department_id);
    }

    if (category_id) {
        query += ' AND d.category_id = ?';
        params.push(category_id);
    }

    if (search) {
        query += ' AND (d.title LIKE ? OR d.filename LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY d.upload_date DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// Download document
router.get('/download/:id', authenticateToken, (req, res) => {
    db.get('SELECT * FROM documents WHERE id = ?', [req.params.id], (err, doc) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!doc) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Set proper headers for UTF-8 filename
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(doc.filename)}`);
        res.sendFile(path.resolve(doc.path));
    });
});

// Delete document
router.delete('/:id', authenticateToken, (req, res) => {
    db.get('SELECT * FROM documents WHERE id = ?', [req.params.id], (err, doc) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!doc) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Check if user is admin or the uploader
        if (req.user.role !== 'admin' && doc.uploaded_by !== req.user.id) {
            return res.status(403).json({ error: 'Permission denied' });
        }

        db.run('DELETE FROM documents WHERE id = ?', [req.params.id], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            // Delete file from filesystem
            if (fs.existsSync(doc.path)) {
                fs.unlinkSync(doc.path);
            }

            res.json({ message: 'Document deleted successfully' });
        });
    });
});

module.exports = router;

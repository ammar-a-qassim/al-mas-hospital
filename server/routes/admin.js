const express = require('express');
const archiver = require('archiver');
const unzipper = require('unzipper');
const fs = require('fs');
const path = require('path');
const db = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/users', authenticateToken, requireAdmin, (req, res) => {
    db.all('SELECT id, username, role, department_id FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// Delete user
router.delete('/users/:id', authenticateToken, requireAdmin, (req, res) => {
    const userId = req.params.id;

    // Prevent deleting yourself
    if (parseInt(userId) === req.user.id) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    db.run('DELETE FROM users WHERE id = ?', [userId], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    });
});

// Get all departments
router.get('/departments', authenticateToken, (req, res) => {
    db.all('SELECT * FROM departments ORDER BY name', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// Add department
router.post('/departments', authenticateToken, requireAdmin, (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Department name required' });
    }

    db.run('INSERT INTO departments (name) VALUES (?)', [name], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                return res.status(400).json({ error: 'Department already exists' });
            }
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({
            message: 'Department created successfully',
            id: this.lastID,
            name: name
        });
    });
});

// Edit department
router.put('/departments/:id', authenticateToken, requireAdmin, (req, res) => {
    const { name } = req.body;
    const departmentId = req.params.id;

    if (!name) {
        return res.status(400).json({ error: 'Department name required' });
    }

    db.run('UPDATE departments SET name = ? WHERE id = ?', [name, departmentId], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                return res.status(400).json({ error: 'Department name already exists' });
            }
            return res.status(500).json({ error: 'Database error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.json({ message: 'Department updated successfully', id: departmentId, name: name });
    });
});

// Delete department
router.delete('/departments/:id', authenticateToken, requireAdmin, (req, res) => {
    db.run('DELETE FROM departments WHERE id = ?', [req.params.id], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.json({ message: 'Department deleted successfully' });
    });
});

// Get all categories
router.get('/categories', authenticateToken, (req, res) => {
    db.all('SELECT * FROM categories ORDER BY name', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// Add category
router.post('/categories', authenticateToken, requireAdmin, (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Category name required' });
    }

    db.run('INSERT INTO categories (name) VALUES (?)', [name], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                return res.status(400).json({ error: 'Category already exists' });
            }
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({
            message: 'Category created successfully',
            id: this.lastID,
            name: name
        });
    });
});

// Edit category
router.put('/categories/:id', authenticateToken, requireAdmin, (req, res) => {
    const { name } = req.body;
    const categoryId = req.params.id;

    if (!name) {
        return res.status(400).json({ error: 'Category name required' });
    }

    db.run('UPDATE categories SET name = ? WHERE id = ?', [name, categoryId], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                return res.status(400).json({ error: 'Category name already exists' });
            }
            return res.status(500).json({ error: 'Database error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category updated successfully', id: categoryId, name: name });
    });
});

// Delete category
router.delete('/categories/:id', authenticateToken, requireAdmin, (req, res) => {
    db.run('DELETE FROM categories WHERE id = ?', [req.params.id], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    });
});

// Configure multer for restore upload
const upload = require('multer')({ dest: 'uploads/temp/' });

// Create backup
router.get('/backup', authenticateToken, requireAdmin, async (req, res) => {
    const archive = archiver('zip', { zlib: { level: 9 } });

    res.attachment('hospital-backup.zip');
    archive.pipe(res);

    // 1. Export Database Data to JSON
    const data = {};

    try {
        // Helper to get all rows from a table
        const getTableData = (table) => {
            return new Promise((resolve, reject) => {
                db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        };

        // Fetch all data
        data.users = await getTableData('users');
        data.departments = await getTableData('departments');
        data.categories = await getTableData('categories');
        data.documents = await getTableData('documents');

        // Add data.json to archive
        archive.append(JSON.stringify(data, null, 2), { name: 'data.json' });

        // 2. Add uploads directory
        if (fs.existsSync(path.resolve(__dirname, '../uploads/'))) {
            archive.directory(path.resolve(__dirname, '../uploads/'), 'uploads');
        }

        archive.finalize();

    } catch (error) {
        console.error('Backup error:', error);
        res.status(500).json({ error: 'Backup failed' });
    }
});

// Restore backup
router.post('/restore', authenticateToken, requireAdmin, upload.single('backup'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No backup file uploaded' });
    }

    const zipPath = req.file.path;
    const extractPath = path.resolve(__dirname, '../uploads/temp/extract');

    try {
        // 1. Extract Zip
        const directory = await unzipper.Open.file(zipPath);
        await directory.extract({ path: extractPath });

        // 2. Read and Restore Data
        const dataPath = path.join(extractPath, 'data.json');
        if (fs.existsSync(dataPath)) {
            const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

            // Restore in order (handle dependencies)

            // Departments
            if (data.departments) {
                for (const dept of data.departments) {
                    await new Promise((resolve) => {
                        db.run('INSERT OR IGNORE INTO departments (id, name) VALUES (?, ?)', [dept.id, dept.name], resolve);
                    });
                }
            }

            // Categories
            if (data.categories) {
                for (const cat of data.categories) {
                    await new Promise((resolve) => {
                        db.run('INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)', [cat.id, cat.name], resolve);
                    });
                }
            }

            // Users
            if (data.users) {
                for (const user of data.users) {
                    await new Promise((resolve) => {
                        db.run('INSERT OR IGNORE INTO users (id, username, password, role, department_id) VALUES (?, ?, ?, ?, ?)',
                            [user.id, user.username, user.password, user.role, user.department_id], resolve);
                    });
                }
            }

            // Documents
            if (data.documents) {
                for (const doc of data.documents) {
                    await new Promise((resolve) => {
                        db.run('INSERT OR IGNORE INTO documents (id, title, filename, path, department_id, category_id, uploaded_by, upload_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                            [doc.id, doc.title, doc.filename, doc.path, doc.department_id, doc.category_id, doc.uploaded_by, doc.upload_date], resolve);
                    });
                }
            }
        }

        // 3. Restore Files
        const uploadsExtractPath = path.join(extractPath, 'uploads');
        const uploadsDestPath = path.resolve(__dirname, '../uploads/');

        if (fs.existsSync(uploadsExtractPath)) {
            // Ensure destination exists
            if (!fs.existsSync(uploadsDestPath)) {
                fs.mkdirSync(uploadsDestPath, { recursive: true });
            }

            // Copy files
            const files = fs.readdirSync(uploadsExtractPath);
            for (const file of files) {
                const src = path.join(uploadsExtractPath, file);
                const dest = path.join(uploadsDestPath, file);
                fs.copyFileSync(src, dest);
            }
        }

        // Cleanup
        fs.unlinkSync(zipPath);
        fs.rmSync(extractPath, { recursive: true, force: true });

        res.json({ message: 'Restore completed successfully' });

    } catch (error) {
        console.error('Restore error:', error);
        // Cleanup on error
        if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
        if (fs.existsSync(extractPath)) fs.rmSync(extractPath, { recursive: true, force: true });

        res.status(500).json({ error: 'Restore failed: ' + error.message });
    }
});

module.exports = router;

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, 'hospital.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        db.run("PRAGMA foreign_keys = ON");
        db.run("PRAGMA encoding = 'UTF-8'");

        // Departments
        db.run(`CREATE TABLE IF NOT EXISTS departments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        )`);

        // Categories
        db.run(`CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        )`);

        // Users
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user', -- 'admin' or 'user'
            department_id INTEGER,
            FOREIGN KEY (department_id) REFERENCES departments(id)
        )`);

        // Documents
        db.run(`CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            filename TEXT NOT NULL,
            path TEXT NOT NULL,
            department_id INTEGER NOT NULL,
            category_id INTEGER NOT NULL,
            uploaded_by INTEGER NOT NULL,
            upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (department_id) REFERENCES departments(id),
            FOREIGN KEY (category_id) REFERENCES categories(id),
            FOREIGN KEY (uploaded_by) REFERENCES users(id)
        )`);

        // Create default admin user if not exists
        const adminUsername = 'admin';
        const adminPassword = 'admin123'; // Change this in production!
        const saltRounds = 10;

        db.get("SELECT id FROM users WHERE username = ?", [adminUsername], (err, row) => {
            if (err) {
                console.error(err.message);
                return;
            }
            if (!row) {
                bcrypt.hash(adminPassword, saltRounds, (err, hash) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [adminUsername, hash, 'admin'], (err) => {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log('Default admin user created.');
                        }
                    });
                });
            }
        });

        // Seed some initial data for testing
        db.get("SELECT count(*) as count FROM departments", (err, row) => {
            if (row && row.count === 0) {
                const depts = ['General', 'Cardiology', 'Neurology', 'Pediatrics'];
                const stmt = db.prepare("INSERT INTO departments (name) VALUES (?)");
                depts.forEach(d => stmt.run(d));
                stmt.finalize();
                console.log('Seeded departments.');
            }
        });

        db.get("SELECT count(*) as count FROM categories", (err, row) => {
            if (row && row.count === 0) {
                const cats = ['Rules', 'Regulations', 'Laws', 'S.O.P.s'];
                const stmt = db.prepare("INSERT INTO categories (name) VALUES (?)");
                cats.forEach(c => stmt.run(c));
                stmt.finalize();
                console.log('Seeded categories.');
            }
        });
    });
}

module.exports = db;

const sqlite3 = require('sqlite3');
const crypto = require('crypto');

class DB {
    constructor() {
        this.db = null;
    }

    async initDatabase() {
        if (this.db !== null) {
            return this.db;
        }

        this.db = new sqlite3.Database('database.db', (err) => {
            if (err) {
                console.error('Error opening database:', err);
            }
        });

        await new Promise((resolve, reject) => {
            this.db.run(`
                CREATE TABLE IF NOT EXISTS slash_command_hashes (
                    name TEXT PRIMARY KEY,
                    hash TEXT NOT NULL,
                    command_id INTEGER NOT NULL
                );
            `, (err) => err ? reject(err) : resolve());
        });
    }

    hashCommandData(data) {
        return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
    }

    async getCommandHash(name) {
        return new Promise((resolve, reject) => {
            this.db.get(
                `SELECT hash FROM slash_command_hashes WHERE name = ?;`,
                [name],
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row ? row.hash : null);
                }
            );
        });
    }

    async updateCommandHash(name, hash, command_id) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `INSERT INTO slash_command_hashes (name, hash, command_id)
                VALUES (?, ?, ?)
                ON CONFLICT(name) DO UPDATE SET hash = excluded.hash;`,
                [name, hash, command_id],
                (err) => {
                    if (err) return reject(err);
                    resolve();
                }
            );
        });
    }

}

module.exports = { DB };
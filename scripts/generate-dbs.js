const sqlite3 = require('sqlite3');
const fs      = require('fs').promises;
const path    = require('path');

const LOCALIZATION_DIR = 'localizations';
const DIST_DIR         = 'dist';

async function ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
}

async function processFile(file) {
    const lang     = path.basename(file, '.json');
    const jsonPath = path.join(LOCALIZATION_DIR, file);
    const dbPath   = path.join(DIST_DIR, `${lang}.db`);
    const content  = await fs.readFile(jsonPath, 'utf8');
    const data     = JSON.parse(content);

    await new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {
            if (err) return reject(err);

            db.serialize(() => {
                db.run('PRAGMA journal_mode = MEMORY');
                db.run('PRAGMA synchronous = OFF');

                db.run('DROP TABLE IF EXISTS MultiText');
                db.run('CREATE TABLE MultiText (Id TEXT PRIMARY KEY, Content TEXT)');

                db.run('BEGIN TRANSACTION');
                const stmt = db.prepare('INSERT INTO MultiText (Id, Content) VALUES (?, ?)');

                for (const [id, text] of Object.entries(data)) {
                    stmt.run(id, text);
                }

                stmt.finalize();
                db.run('COMMIT', err => {
                    db.close(closeErr => {
                        if (err || closeErr) return reject(err || closeErr);
                        resolve();
                    });
                });
            });
        });
    });

    console.log(`✅ Created ${dbPath}`);
}

async function generateDbs() {
    await ensureDir(DIST_DIR);
    const files = await fs.readdir(LOCALIZATION_DIR);
    for (const file of files.filter(f => f.endsWith('.json'))) {
        await processFile(file);
    }
}

generateDbs();

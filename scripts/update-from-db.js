const sqlite3       = require('sqlite3').verbose();
const fs            = require('fs').promises;
const { promisify } = require('util');

const SRC_PATH    = 'src/lang_multi_text.db';
const OUTPUT_PATH = 'localizations/en.json';

async function loadDatabase(path) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(path, sqlite3.OPEN_READONLY, err => {
        if (err) reject(err);
            else resolve(db);
        });
    });
}

async function fetchMultiText(db) {
    const all = promisify(db.all.bind(db));
    return all('SELECT Id, Content FROM MultiText');
}

async function closeDatabase(db) {
    const close = promisify(db.close.bind(db));
    return close();
}

async function writeJsonFile(path, data) {
    const json = JSON.stringify(data, null, 2);
    await fs.writeFile(path, json, 'utf8');
}

async function updateFromDb() {
    const db = await loadDatabase(SRC_PATH);
    try {
        const rows = await fetchMultiText(db);
        const localized = rows.reduce((acc, { Id, Content }) => {
            acc[Id] = Content;
            return acc;
        }, {});
        await writeJsonFile(OUTPUT_PATH, localized);
        console.log(`✅ Dumped MultiText to ${OUTPUT_PATH}`);
    } catch (err) {
        console.error('❌ Failed to update localizations:', err);
    } finally {
        await closeDatabase(db);
    }
}

updateFromDb();

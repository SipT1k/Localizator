const sqlite3 =       require("sqlite3").verbose();
const fs =            require("fs").promises;
const path =          require("path");
const { promisify } = require("util");

const SRC_PATH = "src/lang_multi_text.db";
const LOCALES_DIR = "localizations";
const BASE_LOCALE = "en.json";

async function loadDatabase(path) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(path, sqlite3.OPEN_READONLY, (err) => {
            if (err) reject(err);
            else resolve(db);
        });
    });
}

async function fetchMultiText(db) {
    const all = promisify(db.all.bind(db));
    return all("SELECT Id, Content FROM MultiText");
}

async function closeDatabase(db) {
    const close = promisify(db.close.bind(db));
    return close();
}

async function writeJsonFile(path, data) {
    const json = JSON.stringify(data, null, 4);
    await fs.writeFile(path, json, "utf8");
}

async function updateFromDb() {
    const db = await loadDatabase(SRC_PATH);
    try {
        const rows = await fetchMultiText(db);
        const en = rows.reduce((acc, { Id, Content }) => {
            acc[Id] = Content;
            return acc;
        }, {});

        const enPath = path.join(LOCALES_DIR, BASE_LOCALE);
        await writeJsonFile(enPath, en);
        console.log(`✅ Dumped MultiText to ${enPath}`);

        const files = await fs.readdir(LOCALES_DIR);
        const otherLocales = files.filter(
            (fn) => fn.endsWith(".json") && fn !== BASE_LOCALE
        );

        await Promise.all(
            otherLocales.map(async (file) => {
                const filePath = path.join(LOCALES_DIR, file);
                let old = {};
                try {
                    const raw = await fs.readFile(filePath, "utf8");
                    old = JSON.parse(raw);
                } catch (e) {
                    console.warn(`⚠️ Could not read ${file}, starting fresh.`);
                }

                const updated = Object.keys(en).reduce((acc, key) => {
                    acc[key] = old[key] != null ? old[key] : en[key];
                    return acc;
                }, {});

                await writeJsonFile(filePath, updated);
                console.log(`🔄 Updated ${filePath}`);
            })
        );
    } catch (err) {
        console.error("❌ Failed to update localizations:", err);
    } finally {
        await closeDatabase(db);
    }
}

updateFromDb();

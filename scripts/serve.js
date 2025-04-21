const http        = require('http');
const fs          = require('fs');
const { promises: fsPromises } = fs;
const path        = require('path');

const HOST     = '127.0.0.1';
const PORT     = 2105;
const DIST_DIR = 'dist';


async function getDbFiles() {
    try {
        const files = await fsPromises.readdir(DIST_DIR);
        return files.filter(file => path.extname(file) === '.db');
    } catch {
        throw new Error(`Directory ${DIST_DIR} not found. Did you run 'pnpm generate-dbs' first?`);
    }
}

function createUrl(file) {
    return `http://${HOST}:${PORT}/${file}`;
}

async function startServer() {
    const dbFiles = await getDbFiles();

    console.log('Serving the following translations:');
    dbFiles.forEach(file => {
        const code = path.basename(file, '.db').toUpperCase();
        console.log(`${code}: ${createUrl(file)}`);
    });

    const server = http.createServer(async (req, res) => {
        const requested = req.url.slice(1); // drop leading '/'
        if (!dbFiles.includes(requested)) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('Not Found');
        }

        const filePath = path.join(DIST_DIR, requested);
        try {
            const stats = await fsPromises.stat(filePath);
            res.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-Length': stats.size,
                'Content-Disposition': `attachment; filename="${requested}"`,
            });
            fs.createReadStream(filePath).pipe(res);
        } catch (err) {
            console.error(`Error serving ${requested}:`, err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server Error');
        }
    });

    server.listen(PORT, HOST, () => {
        console.log(`\nServer listening at http://${HOST}:${PORT}`);
    });
}

startServer().catch(err => {
    console.error('❌ Failed to start server:', err);
});

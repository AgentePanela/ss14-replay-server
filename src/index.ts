import express from 'express';
import fs from 'fs';
import https from 'https';
import path from 'path';
import serveIndex from 'serve-index';
import { configManager } from './configManager';

const app = express();

// config setup
const config = configManager.getConfig();
const port = config.port;
const replayDirectory = config.replayDir;

// ssl setup
let server;
if (config.ssl.active) {
    try {
        const privateKey = fs.readFileSync(config.ssl.private, 'utf8');
        const certificate = fs.readFileSync(config.ssl.certificate, 'utf8');
        const credentials = { key: privateKey, cert: certificate };

        // run the server in https
        server = https.createServer(credentials, app);
        console.log(`Running in: https://localhost:${port}`);
    } catch (error) {
        console.error('SSL files not found or error reading SSL files, falling back to HTTP.');
    }
}

if (!server) {
    // fallback http
    server = app.listen(port, () => {
        console.log(`Running in: http://localhost:${port}`);
    });
}

// replay route
app.use('/replays', express.static(replayDirectory), serveIndex(replayDirectory, { icons: true }));


app.use('/', express.static(path.join(__dirname, 'static')));
app.use('/', serveIndex(path.join(__dirname, 'static'), { icons: true }));

/*
app.get('/', (req, res) => {
    res.send('<h1>Gabystation replays</h1>');
});
*/
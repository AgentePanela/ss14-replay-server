import express from 'express';
import fs from 'fs';
import https from 'https';
import path from 'path';
import serveIndex from 'serve-index';

const app = express();
const port = 1414;

// ssl setup
const privateKey = fs.readFileSync('/etc/letsencrypt/live/tucanostation.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/tucanostation.com/fullchain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const replayDirectory = '/home/gabystation/watchdog/SS14.Watchdog/bin/instances/gabynatal/data/replays';

// replay route
app.use('/replays', express.static(replayDirectory), serveIndex(replayDirectory, { 'icons': true }));

// main
app.get('/', (req, res) => {
    res.send('<h1>Gabystation replays</h1>');
});


https.createServer(credentials, app).listen(port, () => {
    console.log(`Running in: https://localhost:${port}`);
});

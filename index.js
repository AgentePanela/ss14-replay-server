const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const serveIndex = require('serve-index');

const app = express();
const port = 1414;

// cert
const privateKey = fs.readFileSync('/etc/letsencrypt/live/tucanostation.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/tucanostation.com/fullchain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// replay dir
const replayDirectory = '/home/gabystation/watchdog/SS14.Watchdog/bin/instances/gabynatal/data/replays';

// replay list
app.use('/replays', express.static(replayDirectory), serveIndex(replayDirectory, {'icons': true}));

app.get('/', (req, res) => {
    res.send('<h1>Gabystation replays</h1>');
});

// server running :)
https.createServer(credentials, app).listen(port, () => {
    console.log(`Running in: http(s)://localhost:${port}`);
});

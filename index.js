const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const serveIndex = require('serve-index');

const app = express();
const port = 3000;

// cert
const privateKey = fs.readFileSync('/etc/letsencrypt/private.key', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/server.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// replay dir
const replayDirectory = '/home/gabystation/watchdog/SS14.Watchdog/bin/instances/gabynatal/data/replays';

// replay list
app.use('/replays', express.static(replayDirectory), serveIndex(replayDirectory, {'icons': true}));

app.get('/', (req, res) => {
    res.send('<h1>Gabystation replays</h1>');
});

// Criando o servidor HTTPS
https.createServer(credentials, app).listen(port, () => {
    console.log(`Running in: http(s)://localhost:${port}`);
});

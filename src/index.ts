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
        server.listen(port, () => {
            console.log(`Running in: https://localhost:${port}`);
        });
        server.on('error', (err) => {
            console.error('Error while starting HTTPS server:', err);
        });
    } catch (error) {
        console.error('SSL files not found or error reading SSL files, falling back to HTTP.');
        console.error(error);
    }
}

if (!server) {
    // fallback http
    server = app.listen(port, () => {
        console.log(`Running in: http://localhost:${port}`);
    });

    server.on('error', (err) => {
        console.error('Error while starting HTTP server:', err);
    });
}

/*
    routes
*/
// replay route
if(!replayDirectory) {
    app.get('/replays', (req, res) => { res.send("Local replay route is deactivated.") });
    app.get('/list', (req, res) => { res.send("Local replay route is deactivated.") });
}
else {
    app.use('/replays', express.static(replayDirectory), serveIndex(replayDirectory, { icons: true }));

    app.get('/list', (req, res) => {
        fs.readdir(replayDirectory, (err, files) => {
            if (err) {
                return res.status(500).send(`Error getting replays. - ${err}`);
            }
    
            const zipFiles = files.filter(file => file.endsWith('.zip'));
    
            if (zipFiles.length === 0) {
                return res.send("<span class='error'>Theres no avaible replays</span>");
            }

            zipFiles.sort((a, b) => {
                const filePathA = path.join(replayDirectory, a);
                const filePathB = path.join(replayDirectory, b);
            
                const statsA = fs.statSync(filePathA);
                const statsB = fs.statSync(filePathB);
            
                return statsB.birthtime.getTime() - statsA.birthtime.getTime();
            });
    
            let fileListHtml = "<ul>";
            zipFiles.forEach(file => {
                const filePath = path.join(replayDirectory, file);
                const stats = fs.statSync(filePath);
                const creationDate = stats.birthtime.toLocaleString();

                fileListHtml += `<li class="angle-rect"><a href='/replays/${file}' download>${file}</a> <small>${creationDate}</small></li>`;
            });
            fileListHtml += "</ul>";
    
            res.send(fileListHtml);
        });
    });
}

// get all in static folder
app.use('/', express.static(path.join(__dirname, 'static')));
app.use('/', serveIndex(path.join(__dirname, 'static'), { icons: true }));

/*
    API
*/
// shitcode, pass to a json

//get name (super easy grrr)
app.get('/name', (req, res) => {
    res.send(config.serverName);
});

app.get('/ip', (req, res) => {
    res.send(config.serverIp);
});

app.get('/discord', (req, res) => {
    res.send(config.discord);
});

app.get('/github', (req, res) => {
    res.send(config.githubLink);
});
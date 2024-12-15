const express = require('express');
const path = require('path');
const app = express();
const port = 1414;


const replayDirectory = '/home/gabystation/watchdog/SS14.Watchdog/bin/instances/gabynatal/data/replays';


app.use('/replays', express.static(replayDirectory));


app.get('/', (req, res) => {
    res.send('<h1>Servidor de Replays do SS14</h1>');
});

app.listen(port, () => {
    console.log(`Servidor de replays rodando em http://localhost:${port}`);
});

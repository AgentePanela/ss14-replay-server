const express = require('express');
const path = require('path');
const app = express();
const port = 1313; // Ou outro número de porta, se necessário

// Diretório onde os replays estão armazenados
const replayDirectory = '/home/gabystation/watchdog/SS14.Watchdog/bin/instances/gabynatal/data/replays';

// Serve os arquivos estáticos (os replays)
app.use('/replays', express.static(replayDirectory));

// Rota padrão para verificar se o servidor está funcionando
app.get('/', (req, res) => {
    res.send('<h1>Servidor de Replays do SS14</h1>');
});

app.listen(port, () => {
    console.log(`Servidor de replays rodando em http://localhost:${port}`);
});

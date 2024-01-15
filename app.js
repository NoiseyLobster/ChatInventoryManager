const express = require('express')
const server = express()
const port = 8080

//make resources avaliable in the public directories for download to the browser 
server.use(express.static('fileHostingForOBS'));

//HTTP GET
//Routing for the base url
server.get('/', (req, res) => {
    res.sendFile(__dirname + "/panelExtension/panel.html");
});

server.get('/config.html', (req, res) => {
    res.sendFile(__dirname + "/panelExtension/panel.html");
});

server.get('/panel.html', (req, res) => {
    res.sendFile(__dirname + "/panelExtension/panel.html");
});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
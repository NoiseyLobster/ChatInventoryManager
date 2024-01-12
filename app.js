const express = require('express')
const server = express()
const port = 8080

//make resources avaliable in the public directory for download to the browser 
server.use(express.static('public'));

//HTTP GET
//Routing for the base url
server.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/panel.html");
});

server.get('/config.html', (req, res) => {
    res.sendFile(__dirname + "/public/panel.html");
})

server.get('/panel.html', (req, res) => {
    res.sendFile(__dirname + "/public/panel.html");
})

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
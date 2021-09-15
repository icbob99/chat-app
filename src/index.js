const express = require('express')
const path = require('path')
const http = require('http');

const app = express()
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server);

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    socket.emit('message', 'Welcome!')

    socket.on('sendMessage', (msg) => {        
        io.emit('message', msg);
    })
});



const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log('Server is up on port ' + port)
})

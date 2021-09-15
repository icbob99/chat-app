const express = require('express')
const path = require('path')
const http = require('http');

const app = express()
const server = http.createServer(app);
const { Server } = require('socket.io');
const Filter = require('bad-words')


const io = new Server(server);

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    socket.broadcast.emit('message', 'Hi new user has join!')

    socket.on('disconnect', () => {
        socket.broadcast.emit('message', 'A user has left!')        
    })

    socket.on('sendMessage', (msg, callback) => {
        var customFilter = new Filter({ placeHolder: 'x' });

        if (customFilter.isProfane(msg)) {
            return callback('Profanity is not allowed!')
        }

        socket.broadcast.emit('message', msg);
        callback('Delivered');
    })

    socket.on('sendLocation', (coords, callback) => {
        socket.broadcast.emit('message', `https://google.com?maps?q=${coords.latitude},${coords.longitude}`);
        callback('Location Shared!')
    })
});



const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log('Server is up on port ' + port)
})

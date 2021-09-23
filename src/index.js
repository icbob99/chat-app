const express = require('express');
const path = require('path');
const http = require('http');

const {generateMessage} = require('./utils/messages')


const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const Filter = require('bad-words');


const io = new Server(server);

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));


io.on('connection', (socket) => {
    socket.emit('message', generateMessage('Welcome!'))
    socket.broadcast.emit('message', generateMessage('Hi, a new user has join!'))

    socket.on('disconnect', () => {
        socket.broadcast.emit('message', generateMessage( 'A user has left!'))
    });

    socket.on('sendMessage', (msg, callback) => {
        var customFilter = new Filter({ placeHolder: 'x' });

        if (customFilter.isProfane(msg)) {
            return callback('Profanity is not allowed!');
        }

        socket.broadcast.emit('message', generateMessage(  msg));
        // callback('Delivered');
        callback()
    });

    socket.on('sendLocation', (coords, callback) => {
        // socket.broadcast.emit('message', `https://google.com?maps?q=${coords.latitude},${coords.longitude}`);
        socket.broadcast.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
        // callback('Location Shared!');
        callback()
    });
});



const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('Server is up on port ' + port);
})

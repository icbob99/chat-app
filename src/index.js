const express = require('express');
const path = require('path');
const http = require('http');

const { generateMessage, genrateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/user')

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const Filter = require('bad-words');


const io = new Server(server);

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));


io.on('connection', (socket) => {
    socket.on('join', ({ username, room }, callback) => {

        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        //general call
        // socket.emit, io.emit, socket.broadcast.emit
        //call inside room
        // io.to.emit , socjet.broadcast.to.emit
        socket.emit('message', generateMessage('Welcome!', 'Admin'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has join!`, 'Admin'))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (msg, callback) => {
        var customFilter = new Filter({ placeHolder: 'x' });

        if (customFilter.isProfane(msg)) {
            return callback('Profanity is not allowed!');
        }

        const user = getUser(socket.id)
        if (!user)
            return callback('No user!!!')


        io.to(user.room).emit('message', generateMessage(msg, user.username));
        // callback('Delivered');
        callback()
    });

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        if (!user)
            return callback('No user!!!')

        // socket.broadcast.emit('message', `https://google.com?maps?q=${coords.latitude},${coords.longitude}`);
        io.to(user.room).emit('locationMessage', genrateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`, user.username));
        // callback('Location Shared!');
        callback()
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`, 'Admin'))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    });
});



const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('Server is up on port ' + port);
})

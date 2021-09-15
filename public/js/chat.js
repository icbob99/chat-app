const socket = io();


socket.on('message', (msg) => {
    console.log(msg)
})

var inpt = document.getElementById('input');
document.querySelector('#message-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const message = inpt.value

    if (message) {

        socket.emit('sendMessage', message);
        inpt.value = ''
    }
});
const socket = io();


socket.on('message', (msg) => {
    console.log(msg)
})

var inpt = document.getElementById('input');
document.querySelector('#message-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const message = inpt.value

    if (message) {

        socket.emit('sendMessage', message, (error) => {
            if (error) {
                return console.log(error)
            }
        });
        inpt.value = ''
    }
});

document.querySelector('#send-location').addEventListener('click', function (e) {
    e.preventDefault();

    if (!navigator.geolocation) {
        socket.emit('sendMessage', 'Geolocation is not supported by your browser');
    } else {
        // status.textContent = 'Locating…';
        navigator.geolocation.getCurrentPosition(success, error);
    }
})

function error() {
    socket.emit('sendMessage', 'Unable to retrieve your location');
}

function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    socket.emit('sendLocation', {
        latitude: latitude,
        longitude: longitude
    }, (ack_message) => {
        console.log( ack_message)
    });
}

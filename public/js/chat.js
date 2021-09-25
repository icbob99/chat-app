const socket = io();

//Elements
const $messageForm = document.querySelector('#message-form');
const $messageInputForm = $messageForm.querySelector('input');
const $messageButtonForm = $messageForm.querySelector('button');
const $locationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
const $urls = document.querySelector('#url');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const urlTemplate = document.querySelector('#url-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        userName: message.userName,
        createdAt: moment(message.createdAt).format('h:mm A')
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (locationMessage) => {
    console.log(locationMessage)

    const html = Mustache.render(urlTemplate, {
        url: locationMessage.url,
        userName: locationMessage.userName,
        createdAt: moment(locationMessage.createdAt).format('h:mm A')
    });
    $messages.insertAdjacentHTML('beforeend', html);
})

socket.on('roomData', ({ room, users }) => {
    // console.log(room)
    // console.log(users)
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const message = e.target.elements.message.value;//inpt.value
    //  console.log(`e.target.elements.message.value ${e.target.elements.message.value}`)
    //  console.log(`messageInputForm ${$messageInputForm.value}`)

    if (message) {
        $messageButtonForm.setAttribute('disabled', 'disabled');

        socket.emit('sendMessage', message, (error) => {
            $messageButtonForm.removeAttribute('disabled');
            if (error) {
                return console.log(error);
            }
        });
        $messageInputForm.value = '';
        $messageInputForm.focus();
    }
});

$locationButton.addEventListener('click', function (e) {
    e.preventDefault();

    if (!navigator.geolocation) {
        socket.emit('sendMessage', 'Geolocation is not supported by your browser');
    } else {
        $locationButton.setAttribute('disabled', 'disabled');
        navigator.geolocation.getCurrentPosition(success, error);

    }
})

function error() {
    socket.emit('sendMessage', 'Unable to retrieve your location');
    $locationButton.removeAttribute('disabled')
}

function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    socket.emit('sendLocation', {
        latitude: latitude,
        longitude: longitude
    }, (ack_message) => {
        console.log(ack_message);
        $locationButton.removeAttribute('disabled');
    });
}

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})
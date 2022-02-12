const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

const autoscroll = () => {
    const $newMessage = $messages.lastElementChild;

    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    const visibleHeight = $messages.offsetHeight;
    const containerHeight = $messages.scrollHeight;
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }

};

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.elements.message.value;
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if(!message)
        return alert('Please enter a valid message.');
    socket.emit('message', message);
});

socket.on('message', (data) => {
    const html = Mustache.render(messageTemplate, {
        username: data.username,
        message: data.text,
        createdAt: moment(data.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
});



$sendLocationButton.addEventListener('click', () => {
    const geolocation = null;
    navigator.geolocation.getCurrentPosition(
        position => {
            const coordinates = {latitude: position.coords.latitude, longitude: position.coords.longitude};
            socket.emit('location', coordinates);
        },
        error => {
            alert('Not supported');
        }
    )
});

socket.on('location', (data) => {
    const html = Mustache.render(locationMessageTemplate, {
        username: data.username,
        url: data.locationURL,
        createdAt: moment(data.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.emit('join', {username, room}, (error) => {
    if(error) {
        alert(error);
        location.href = '/';
    }
});

socket.on('roomData',  ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room, users
    });

    document.querySelector('#sidebar').innerHTML = html;
});
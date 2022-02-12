const generateMessage = (username, messageText) => {
    return {
        username,
        text: messageText,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (username, location) => {
    url = `https://maps.google.com?q=${location.latitude},${location.longitude}`;
    return {
        username,
        locationURL: url,
        createdAt: new Date().getTime()
    }
}


module.exports = {
    generateMessage,
    generateLocationMessage
}
const generateMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

const genrateLocationMessage = (url) => {
    return {
        url: url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
     genrateLocationMessage
}
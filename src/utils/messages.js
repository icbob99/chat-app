const generateMessage = (text, userName) => {
    return {
        text,
        createdAt: new Date().getTime(),
        userName
    }
}

const genrateLocationMessage = (url, userName) => {
    return {
        url,
        createdAt: new Date().getTime(),
        userName
    }
}

module.exports = {
    generateMessage,
     genrateLocationMessage
}
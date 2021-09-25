const users = []

const addUser = ({ id, username, room }) => {
    //Clea the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //Validate the data
    if (!username || !room) {
        return {
            error: 'User Name and room are required!'
        }
    }

    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    })

    //Validate username
    if (existingUser) {
        return {
            error: 'User name is in use!'
        }
    }

    //store user
    const user = { id, username, room }
    users.push(user)

    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        //remove 1 item from index and return its value (it is also array of size 1)
        return users.splice(index, 1)[0]
    }

    return undefined;
}
const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.room === room)
}


module.exports = {
    addUser, removeUser, getUser, getUsersInRoom
}
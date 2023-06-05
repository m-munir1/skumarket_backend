const userModel = require("../../models/user.model");

const disconnectHandler = (socket, io) => {
    // socketID
    const socketID = socket.id;

    // get user by socketID and set socketID to null
    userModel.findOneAndUpdate(
        { socketId: socketID },
        { socketId: null },
        { new: true },
        (err, user) => {
            if (err) {
                console.log(err);
            } else {
                console.log("user disconnected 💥" + socket.id);
            }
        }
    );

    const user = socket.user;

    const data = {
        user: {
            _id: user._id,
            name: user.name,
            socketID: user.socketId,
            email: user.email,
        },
        onlineUsers: io.engine.clientsCount,
    };

    // emit online users
    io.emit("disconnect-users", data);
};

module.exports = disconnectHandler;

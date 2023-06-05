const userModel = require("../models/user.model");
const decodedUser = require("./decodedUser");

const authSocket = async (socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;

  try {
    const decoded = decodedUser(token);

    // Check if user still exists
    const currentUser = await userModel.findById(decoded.id);
    if (!currentUser) {
      const socketError = new Error("User not found Naveed");
      return next(socketError);
    }
    currentUser.socketId = socket.id;
    await currentUser.save();
    socket.user = currentUser;
  } catch (err) {
    console.log(err);
    return next(new Error("Authentication error - " + err.message));
  }

  next();
};

module.exports = authSocket;

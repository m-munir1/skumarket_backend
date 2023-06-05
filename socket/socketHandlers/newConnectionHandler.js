const mongoose = require("mongoose");
const Message = require("../../models/message.model");

const newConnectionHandler = async (socket, io) => {
    try {
        const userDetails = socket.user;

        const data = {
            socketId: socket.id,
            userId: userDetails._id,
            name: userDetails.name,
            email: userDetails.email,
            profilePic: userDetails.profilePic,
        };

        io.emit("new-connection", data);

        const admin = process.env.admin || "63e41c8e5258d9b4ec81146e";

        const sender = mongoose.Types.ObjectId(admin);
        const receiver = mongoose.Types.ObjectId(userDetails._id);

        // if the sender and receiver are the same, return
        if (sender.equals(receiver)) return;

        const res = await Message.aggregate([
            {
                $match: {
                    $or: [
                        {
                            $and: [{ sender: sender }, { receiver: receiver }],
                        },
                        {
                            $and: [{ sender: receiver }, { receiver: sender }],
                        },
                    ],
                },
            },
            // count the number of messages
            {
                $count: "count",
            },
        ]);

        const count = res?.[0]?.count || 0;

        if (count === 0) {
            const message = new Message({
                sender: sender,
                receiver: receiver,
                message: "Welcome to SKU Market! How can we help you?",
                type: "text",
            });

            await message.save();
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = newConnectionHandler;

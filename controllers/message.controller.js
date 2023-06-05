const catchAsyncErrors = require("../lib/catchAsyncErrors");
const AppError = require("../util/appError");
const Message = require("../models/message.model");
const { getSocketServerInstance } = require("../socket/serverStore");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");
const fs = require("fs");
const { bucket, bucketName, bucketUpload } = require("../lib/googleBucket");
const Notification = require("../models/notification.model");

exports.getConversation = catchAsyncErrors(async (req, res, next) => {
    const data = await Message.aggregate([
        {
            $match: {
                $or: [{ sender: req.user._id }, { receiver: req.user._id }],
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "receiver",
                foreignField: "_id",
                as: "receiver",
            },
        },
        {
            $group: {
                _id: {
                    $cond: [
                        {
                            $gt: [
                                {
                                    $indexOfArray: [
                                        "$sender._id",
                                        req.user._id,
                                    ],
                                },
                                -1,
                            ],
                        },
                        "$receiver._id",
                        "$sender._id",
                    ],
                },
                lastMessage: { $last: "$$ROOT" },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $project: {
                lastMessage: 1,
                receiver: { $arrayElemAt: ["$user", 0] },
            },
        },
        {
            $sort: { "lastMessage.createdAt": -1 },
        },
        {
            $project: {
                _id: "$lastMessage._id",
                message: "$lastMessage.message",
                type: "$lastMessage.type",
                createdAt: "$lastMessage.createdAt",
                senderId: "$lastMessage.sender._id",
                receiverId: "$lastMessage.receiver._id",
                receiverName: "$receiver.name",
                receiverAvatar: "$receiver.avatar",
                receiverOnline: "$receiver.online",
                receiverSocketId: "$receiver.socketId",
                receiverLastSeen: "$receiver.last_seen",
            },
        },
        {
            $project: {
                _id: 1,
                message: 1,
                type: 1,
                createdAt: 1,
                senderId: { $arrayElemAt: ["$senderId", 0] },
                receiverId: { $arrayElemAt: ["$receiverId", 0] },
            },
        },
        {
            $project: {
                _id: 1,
                message: 1,
                type: 1,
                createdAt: 1,
                user: {
                    $cond: [
                        {
                            $eq: ["$senderId", req.user._id],
                        },
                        "$receiverId",
                        "$senderId",
                    ],
                },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $project: {
                _id: 1,
                message: 1,
                type: 1,
                createdAt: 1,
                partner: { $arrayElemAt: ["$user", 0] },
            },
        },
        {
            $project: {
                _id: 1,
                message: 1,
                type: 1,
                createdAt: 1,
                partner: {
                    _id: "$partner._id",
                    email: "$partner.email",
                    phone: "$partner.phone",
                    city: "$partner.city",
                    country: "$partner.country",
                    name: "$partner.companyName",
                    avatar: "$partner.avatar",
                    socketId: "$partner.socketId",
                    last_seen: "$partner.last_seen",
                    online: {
                        $cond: [
                            {
                                $eq: ["$partner.socketId", null],
                            },
                            false,
                            true,
                        ],
                    },
                },
            },
        },

        {
            $addFields: {
                partner: {
                    $mergeObjects: [
                        "$partner",
                        {
                            address: {
                                $concat: [
                                    "$partner.city",
                                    ", ",
                                    "$partner.country",
                                ],
                            },
                        },
                    ],
                },
            },
        },

        ...req.pipeline,
    ]);

    res.status(200).json({
        success: true,
        total: data[0].total?.[0]?.total || 0,
        result: data[0].data.length,
        data: data[0].data,
    });
});

exports.getConversationById = catchAsyncErrors(async (req, res, next) => {
    const sender = mongoose.Types.ObjectId(req.user._id);
    const receiver = mongoose.Types.ObjectId(req.params.id);

    const data = await Message.aggregate([
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
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "receiver",
                foreignField: "_id",
                as: "receiver",
            },
        },
        {
            $project: {
                _id: 1,
                message: 1,
                type: 1,
                createdAt: 1,
                senderId: { $arrayElemAt: ["$sender._id", 0] },
                receiverId: { $arrayElemAt: ["$receiver._id", 0] },
                sender: {
                    _id: { $arrayElemAt: ["$sender._id", 0] },
                    name: { $arrayElemAt: ["$sender.name", 0] },
                    avatar: { $arrayElemAt: ["$sender.avatar", 0] },
                    online: { $arrayElemAt: ["$sender.online", 0] },
                    socketId: { $arrayElemAt: ["$sender.socketId", 0] },
                    last_seen: { $arrayElemAt: ["$sender.last_seen", 0] },
                    email: { $arrayElemAt: ["$sender.email", 0] },
                },
                receiver: {
                    _id: { $arrayElemAt: ["$receiver._id", 0] },
                    name: { $arrayElemAt: ["$receiver.name", 0] },
                    avatar: { $arrayElemAt: ["$receiver.avatar", 0] },
                    online: { $arrayElemAt: ["$receiver.online", 0] },
                    socketId: { $arrayElemAt: ["$receiver.socketId", 0] },
                    last_seen: { $arrayElemAt: ["$receiver.last_seen", 0] },
                    email: { $arrayElemAt: ["$receiver.email", 0] },
                },
            },
        },
        {
            $project: {
                _id: 1,
                message: 1,
                type: 1,
                createdAt: 1,
                sender: {
                    $arrayElemAt: ["$sender", 0],
                },
                receiver: {
                    $arrayElemAt: ["$receiver", 0],
                },
            },
        },
        {
            $addFields: {
                senderId: "$sender._id",
                receiverId: "$receiver._id",
            },
        },
        ...req.pipeline,
    ]);

    res.status(200).json({
        success: true,
        total: data[0].total?.[0]?.total || 0,
        result: data[0].data.length,
        data: data[0].data?.reverse(),
    });
});

exports.sendMessage = catchAsyncErrors(async (req, res, next) => {
    const sender = req.user._id;
    let { receiver, message, type } = req.body;

    // check if sender and receiver are same
    if (sender.toString() === receiver.toString()) {
        return next(new AppError("You can't send message to yourself", 400));
    }

    // if type is photo then upload photo to bucket
    if (type === "photo") {
        const fileName = req.file.filename;
        const filePath = `./upload/chat_file/${fileName}`;

        // Uploads a local file to the bucket
        const { url } = await bucketUpload(filePath, `chat/photo/${fileName}`);

        message = url;

        // Deleting local file
        fs.unlinkSync(filePath);
    } else if (type === "file") {
        const fileName = req.file.filename;
        const filePath = `./upload/chat_file/${fileName}`;

        // Uploads a local file to the bucket
        const { url } = await bucketUpload(filePath, `chat/file/${fileName}`);

        message = url;

        // Deleting local file
        fs.unlinkSync(filePath);
    }

    const createMessage = await Message.create({
        sender,
        receiver,
        message,
        type,
    });

    const receiverSocketId = await userModel
        .findById(receiver)
        .select("socketId");

    if (receiverSocketId.socketId) {
        const io = getSocketServerInstance();
        io.to(receiverSocketId.socketId).emit("message", createMessage);
    }

    await Notification.create({
        user: receiver,
        message: `${req.user.companyName} sent you a message`,
        url: `/chat`,
    });

    res.status(200).json({
        success: true,
        data: createMessage,
    });
});

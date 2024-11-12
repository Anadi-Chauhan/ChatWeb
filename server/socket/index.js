const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const app = express();
const getUserDetailsFromToken = require("../helper/getUserDetailsFromToken");
const userModel = require("../models/UserModel");
const { ConversationModel, MessageModel } = require("../models/Conversation");
const getConversation = require("../helper/getConversation");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("User connected:", socket.id);

  const token = socket.handshake.auth.token;

  const user = await getUserDetailsFromToken(token);

  socket.join(user._id.toString());
  onlineUser.add(user._id?.toString());

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    console.log("userID", userId);
    const userDetails = await userModel.findById(userId).select("-password");

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: onlineUser.has(userId),
    };

    socket.emit("message-user", payload);

    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, reciever: userId },
        { sender: userId, reciever: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });
    socket.emit("message", getConversationMessage?.messages || []);
  });

  socket.on("new-message", async (data) => {
    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: data.sender, reciever: data.reciever },
        { sender: data.reciever, reciever: data.sender },
      ],
    });
    if (!conversation) {
      const createConversation = await ConversationModel({
        sender: data.sender,
        reciever: data.reciever,
      });
      conversation = await createConversation.save();
    }

    const message = new MessageModel({
      text: data?.text,
      imageUrl: data?.imageUrl,
      videoUrl: data?.videoUrl,
      msgByUserId: data?.msgByUserId,
    });

    const saveMessage = await message.save();

    const updateConversation = await ConversationModel.updateOne(
      { _id: conversation?._id },
      {
        $push: { messages: saveMessage?._id },
      }
    );

    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: data.sender, reciever: data.reciever },
        { sender: data.reciever, reciever: data.sender },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    io.to(data?.sender).emit("message", getConversationMessage.messages || []);
    io.to(data?.reciever).emit(
      "message",
      getConversationMessage.messages || []
    );

    const conversationSender = await getConversation(data?.sender);
    const conversationReciever = await getConversation(data?.reciever);
    console.log("dvdvs",data?.sender)
    io.to(data?.sender).emit("coversation", conversationSender);
    io.to(data?.reciever).emit("conversation", conversationReciever);
  });

  socket.on("sidebar", async (currentUserId) => {
    console.log("xxxxx", currentUserId);

    const conversation = await getConversation(currentUserId);

    socket.emit("conversation", conversation);
  });

  socket.on("seen", async (msgByUserId) => {
    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, reciever: msgByUserId },
        { sender: msgByUserId, reciever: user?._id },
      ],
    });

    const conversationMessageId = conversation?.messages || [];

    const updateMessage = await MessageModel.updateMany(
      {
        _id: { $in: conversationMessageId },
        msgByUserId: msgByUserId,
      },
      { $set: { seen: true } }
    );

    const conversationSender = await getConversation(user?._id?.toString());
    const conversationReciever = await getConversation(msgByUserId);
    io.to(user?._id?.toString()).emit("coversation", conversationSender);
    io.to(msgByUserId).emit("conversation", conversationReciever);
  });

  socket.on("disconnect", () => {
    onlineUser.delete(user?._id?.toString());
    console.log("User disconnected:", socket.id);
  });
});

module.exports = {
  app,
  server,
};

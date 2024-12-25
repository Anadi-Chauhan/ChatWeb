const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const app = express();
const getUserDetailsFromToken = require("../helper/getUserDetailsFromToken");
const userModel = require("../models/UserModel");
const { ConversationModel, MessageModel } = require("../models/Conversation");
const getConversation = require("../helper/getConversation");

const server = http.createServer(app);

const userSocketMap = {};

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const onlineUser = new Set();

io.on("connection", async (socket) => {
  const token = socket.handshake.auth.token;

  const user = await getUserDetailsFromToken(token);

  socket.join(user._id?.toString());

  onlineUser.add(user._id?.toString());
  userSocketMap[user._id] = socket.id;

  io.emit("setup socket", socket.id);
  console.log("sockettttttt", socket.id);
  console.log(`User ${user._id} connected with socket ID ${socket.id}`);

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    const isValidHex = (str) => /^[a-fA-F0-9]{24}$/.test(str);

    if (isValidHex(userId)) {
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
    } else {
      return null;
    }
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
      recieverUserId: data?.recievedByUserId,
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
    console.log("dvdvs", data?.sender);
    io.to(data?.sender).emit("coversation", conversationSender);
    io.to(data?.reciever).emit("conversation", conversationReciever);
  });

  socket.on("sidebar", async (currentUserId) => {
    console.log('ccccc',currentUserId)
    const conversation = await getConversation(currentUserId);

    socket.emit("conversation", conversation);
  });

  // socket.on("seen", async (msgByUserId) => {
  //   let conversation = await ConversationModel.findOne({
  //     $or: [
  //       { sender: user?._id, reciever: msgByUserId },
  //       { sender: msgByUserId, reciever: user?._id },
  //     ],
  //   });

  //   const conversationMessageId = conversation?.messages || [];

  //   const updateMessage = await MessageModel.updateMany(
  //     {
  //       _id: { $in: conversationMessageId },
  //       msgByUserId: msgByUserId,
  //     },
  //     { $set: { seen: true } }
  //   );

  //   const conversationSender = await getConversation(user?._id?.toString());
  //   const conversationReciever = await getConversation(msgByUserId);
  //   io.to(user?._id?.toString()).emit("coversation", conversationSender);
  //   io.to(msgByUserId).emit("conversation", conversationReciever);
  // });

  socket.on("getCalledId", (data) => {
    console.log("zzzz", data);
    calledSocketId = userSocketMap[data];
    console.log("calledSocketID", calledSocketId);
    socket.emit("calledSocketID", calledSocketId);
  });
  socket.on("getCallerId", (data) => {
    console.log("xxx", data);
    callerSocketId = userSocketMap[data];
    console.log("callerSocketID", callerSocketId);
    socket.emit("callerSocketID", callerSocketId);
  });

  socket.on("call-user", async (data) => {
    console.log("vcvcvc", data);
    const callingUser = data.userToCall;
    // console.log('callinguserId',data.id)
    // console.log('callinguserId',callingUserId.socket.id)
    // console.log('calledUSer',callingUser)
    console.log("callingUSerxxx", callingUser);
    io.to(callingUser).emit("call-user", {
      signal: data.signal,
      from: data.from,
    });
    io.to(callingUser).emit("called-user", { user });
  });

  socket.on("answer-call", (data) => {
    console.log("jhbv", data);
    io.to(data.to).emit("call-accepted", data.signal);
    console.log("jhbv", data);
  });

  //guest connection
  
});

module.exports = {
  app,
  server,
};

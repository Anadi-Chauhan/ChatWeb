const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const app = express();
const getUserDetailsFromToken = require("../helper/getUserDetailsFromToken");
const userModel = require("../models/UserModel");
const { ConversationModel, MessageModel } = require("../models/Conversation");
const getConversation = require("../helper/getConversation");
const getGuestDetailsFromToken = require("../helper/getGuestDetailsFromToken");
const { GroupConversationModel } = require("../models/GuestCoversation");

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
const guestUser = new Set()

io.on("connection", async (socket) => {
  const token = socket.handshake.auth.token;

  const user = await getUserDetailsFromToken(token);
    socket.join(user?._id.toString());
    onlineUser.add(user?._id?.toString());
    userSocketMap[user?._id] = socket.id;
    io.emit("setup socket", socket.id);
    io.emit("onlineUser", Array.from(onlineUser));
  socket.on("join-group", async (groupId) => {
    socket.join(groupId);
    const token = socket.handshake.auth.token;
    const user = await getGuestDetailsFromToken(token);
    guestUser.add(user?._id?.toString());
    io.emit("group-participants", Array.from(guestUser));
    const guestDetails = {
      groupId,
      userId: user._id?.toString(),
      userName: user.name,
    };
    io.emit("group-notification", {
      message: `${user.name} joined the group TestGroup"`,
    });
    const groupMembers = Array.from(await io.in(groupId).fetchSockets()).map(
      (s) => s.id
    );

    io.to(groupId).emit("group-members", groupMembers);
    socket.emit("guest-user", guestDetails);
  });

  socket.on("send-group-message", async (data) => {

  
    const messageDetails = {
      senderId: data.senderId,
      senderName : data.senderName,
      message : data.text,
      timestamp: new Date(),
    };

    const groupMessage = new GroupConversationModel({
      groupId: data.groupId.toString(),
      senderId: messageDetails.senderId,
      text: messageDetails.message,
      timestamp: messageDetails.timestamp,
    });

    await groupMessage.save();
    io.emit("group-message", messageDetails);
  });

  // Handle leaving a group
  socket.on("leave-group", ({ groupId, groupName }) => {
    socket.leave(groupId);

    io.to(groupId).emit("group-notification", {
      message: `${user.name} left the group "${groupName}"`,
    }); 
    io.to(groupId).emit("group-notifications", {
      message: `${user.name} left the group "${groupName}"`,
    });

    // Send updated list of users in the group
    const groupMembers = Array.from(io.in(groupId).fetchSockets()).map(
      (s) => s.id
    );

    io.to(groupId).emit("group-members", groupMembers);
  });

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
      audioUrl : data?.audioUrl,
      msgByUserId: data?.msgByUserId,
      recieverUserId: data?.recievedByUserId,
      sender_name: data?.sender_name,
      reciever_name: data?.reciever_name,
      sender_profile_pic: data?.sender_profile_pic,
      reciever_profile_pic: data?.reciever_profile_pic,
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
    io.to(data?.sender).emit("coversation", conversationSender);
    io.to(data?.reciever).emit("conversation", conversationReciever);
  });

  socket.on("sidebar", async (currentUserId) => {
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

  socket.on("getCalledId", (data) => {
    calledSocketId = userSocketMap[data];
    socket.emit("calledSocketID", calledSocketId);
  });
  socket.on("getCallerId", (data) => {
    callerSocketId = userSocketMap[data];
    socket.emit("callerSocketID", callerSocketId);
  });

  socket.on("call-user", async (data) => {
    const callingUser = data.userToCall;
    io.to(callingUser).emit("call-user", {
      signal: data.signal,
      from: data.from,
    });
    io.to(callingUser).emit("called-user", { user });
  });

  socket.on("answer-call", (data) => {
    io.to(data.to).emit("call-accepted", data.signal);
  });
});

module.exports = {
  app,
  server,
};

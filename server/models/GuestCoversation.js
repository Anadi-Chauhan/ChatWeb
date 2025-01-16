const mongoose = require("mongoose");

// Schema for individual messages
const groupMessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
    },
    msgByUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    groupId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Group",
    },
  },
  {
    timestamps: true,
  }
);

// Schema for group conversations
const groupConversationSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Group", // Reference to the Group collection
    },
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Message", // Reference to the individual messages
      },
    ],
    participants: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User", // Users participating in the group
      },
    ],
  },
  {
    timestamps: true,
  }
);

const GroupMessageModel = mongoose.model("GroupMessage", groupMessageSchema);
const GroupConversationModel = mongoose.model(
  "GroupConversation",
  groupConversationSchema
);

module.exports = {
  GroupMessageModel,
  GroupConversationModel,
};

const { ConversationModel } = require("../models/Conversation");

const getConversation = async (currentUserId) => {
    if (currentUserId) {
      
        const currentUserConversation = await ConversationModel.find({
          $or: [{ sender: currentUserId }, { reciever: currentUserId }],
        }).sort({ updatedAt: -1 }).populate("messages").populate("sender").populate("reciever");
        const conversation = currentUserConversation.map((conv) => {
          const countUnseenMsg = conv?.messages?.reduce(
            (prev,curr) => {
              const msgByUserId = curr?.msgByUserId?.toString()
              if (msgByUserId !== currentUserId) {
                return prev + (curr?.seen ? 0 : 1)
                
              }else{
                prev
              }
            },0);
          return {
            _id: conv?._id,
            sender: conv?.sender,
            reciever: conv?.reciever,
            unseenMessage: countUnseenMsg,
            lastMsg: conv?.messages[conv?.messages?.length - 1],
          };
      })

      return conversation
      }else {
        return []
      }
}

module.exports = getConversation
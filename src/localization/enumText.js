const ActionTypeEnum = {
  actiontype: {
    name: "actiontype",
    description: "action the bot takes",
    acceptedTypeEnum: {
      SelfReply: {
        text: "selfreply",
        id: 0,
      },
      ReplyInHere: {
        text: "replyinhere",
        id: 1,
      },
    },
  },
};

module.exports = { ActionTypeEnum };

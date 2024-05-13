const mongoose = require("mongoose");

const MsgSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    recieverId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Msg", MsgSchema);

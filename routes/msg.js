const router = require("express").Router();
const Msg = require("../models/Msg");

//create a msgs

router.post("/", async (req, res) => {
  try {
    const newMsg = new Msg(req.body);
    const savedata = await newMsg.save();
    req.io.emit("messageSend", savedata);
    return res.status(200).json(savedata);
  } catch (error) {
    res.status(400).json(error);
  }
});
// getting all message of a pair
router.post("/all_msg", async (req, res) => {
  try {
    let { senderId, recieverId } = req.body;

    const response = await Msg.aggregate([
      {
        $match: {
          $or: [
            { $and: [{ senderId: senderId }, { recieverId: recieverId }] },
            { $and: [{ senderId: recieverId }, { recieverId: senderId }] },
          ],
        },
      },
      {
        $project: {
          senderId: 1,
          recieverId: 1,
          message: 1,
          createdAt: 1,
        },
      },
    ]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//delete chats of a pair user
router.delete("/delete_chats/:senderId/:recieverId", async (req, res) => {
  try {
    let { senderId, recieverId } = req.params;
    const idsList = await Msg.aggregate([
      {
        $match: {
          $or: [
            { $and: [{ senderId: senderId }, { recieverId: recieverId }] },
            { $and: [{ senderId: recieverId }, { recieverId: senderId }] },
          ],
        },
      },
      { $group: { _id: "$_id" } },
    ]);
    await Msg.remove({ _id: { $in: idsList } });
    return res.status(200).json("Chats deleted successfully");
  } catch (error) {
    res.status(400).json(error);
  }
});
//get sender _Id as notification
router.get("/senders", async (req, res) => {
  try {
    const response = await Msg.findById({ _id: req.userId });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;

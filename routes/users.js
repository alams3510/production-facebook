const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Msg = require("../models/Msg");
const bcrypt = require("bcrypt");

//updating the user details
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        res.status(400).json(error);
      }
    }
    try {
      const updatedData = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedData);
    } catch (error) {
      res.status(400).json(error);
    }
  } else {
    res.status(400).json("you can update only yours profile");
  }
});
//updating the user password

router.put("/:id/updatePassword", async (req, res) => {
  const userId = req.params.id;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(400).json("User not Found");
  }
  const { newPassword, oldPassword } = req.body.passwords;
  const validPassword = await bcrypt.compare(oldPassword, user.password);

  if (!validPassword) {
    return res.status(400).json("Old Password Not Matched");
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const updatedPassword = await bcrypt.hash(newPassword, salt);
    await User.updateOne(
      { _id: req.params.id },
      { $set: { password: updatedPassword } }
    );

    res.status(200).json("password updated successfully");
  } catch (error) {
    res.status(400).json(error);
  }
});

//deleting the user Account

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const idsList = await Msg.aggregate([
      {
        $match: { $or: [{ senderId: userId }, { recieverId: userId }] },
      },
      { $group: { _id: "$_id" } },
    ]);
    await Msg.remove({ _id: { $in: idsList } });
    await Post.deleteMany({ userId });
    await User.findByIdAndDelete(userId);
    res.status(200).json("User deleted");
  } catch (error) {
    res.status().json(error);
  }
});

//get a single user

router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const userdata = userId
      ? await User.findById(userId)
      : await User.findOne({ username });
    const { password, ...other } = userdata._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(400).json(error);
  }
});

//find all friends

router.get("/friends/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const friends = await Promise.all(
      user.followings.map((friendsId) => {
        return User.findOne({ _id: friendsId });
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (error) {
    res.status(500).json(error);
  }
});

//follow a user

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        req.io.emit("follow", {
          follower: req.body,
          followed: user,
        });
        return res.status(200).json("user is followed now");
      } else {
        res.status(200).json("you already following him");
      }
    } catch (error) {
      res.status(400).json(error);
    }
  } else {
    res.status(400).json("you cant follow yourself");
  }
});

//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        req.io.emit("unfollow", {
          follower: req.body,
          followed: user,
        });
        res.status(200).json("user is unfollowed now");
      } else {
        res.status(200).json("you already unfollowed now");
      }
    } catch (error) {
      res.status(400).json(error);
    }
  } else {
    res.status(400).json("you cant follow yourself");
  }
});

//find all user list

router.get("/allUsers", async (req, res) => {
  try {
    const user = await User.find();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

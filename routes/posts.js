const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const cacheMiddleware = require("../cacheMiddleware");
const redisClient = require("../redis");

//create a post

router.post("/", async (req, res) => {
  try {
    redisClient.flushdb();
    const newPost = new Post(req.body);
    const savedata = await newPost.save();
    res.status(200).json(savedata);
  } catch (error) {
    res.status(400).json(error);
  }
});

//update a post

router.put("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userId === req.body.userId) {
    try {
      redisClient.flushdb();
      const data = await Post.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Updated your Post");
    } catch (error) {
      res.status(400).json(error);
    }
  } else {
    res.status(500).json("you cant update any others Post");
  }
});

//delete a post

router.delete("/:id", async (req, res) => {
  try {
    redisClient.flushdb();
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json("post deleted");
  } catch (error) {
    res.status(400).json(error);
  }
});

//like and dislike post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    redisClient.flushdb();
    if (post.likes.includes(req.body.userId) === false) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      req.io.emit("postLiked", {
        likedById: req.body.userId,
        likedToId: post.userId,
        postId: req.params.id,
      });
      return res.status(200).json("you liked the post");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      req.io.emit("postDisLiked", {
        likedById: req.body.userId,
        likedToId: post.userId,
        postId: req.params.id,
      });
      return res.status(200).json("you disliked the post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//get a post
router.get("/:id", cacheMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json(error);
  }
});

//get timeline/all post

router.get("/timeline/:userId", cacheMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.json(userPosts.concat(...friendPosts));
  } catch (error) {
    res.status(500).json(error);
  }
});

//get users all posts

router.get("/profile/:username", cacheMiddleware, async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username: username });
    const post = await Post.find({ userId: user._id });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;

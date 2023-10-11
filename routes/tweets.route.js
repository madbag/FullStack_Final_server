import express from "express";
// import { verifyToken } from "../config/verifyToken.js";
import {
  createTweet,
  deleteTweet,
  likeOrDislike,
  getAllTweets,
  getUserTweets,
  getExploreTweets,
} from "../controllers/tweet.js";
const router = express.Router();
// const fileUploader = require("../config/cloudinary.js")

// Create
router.post("/", createTweet);

// Delete
router.delete("/:id", deleteTweet);

// Like or Dislike
router.put("/:id/like", likeOrDislike);

// get all tweets
router.get("/timeline/:id", getAllTweets);

// get our tweet
router.get("/user/all/:id", getUserTweets);

//explore Tweets
router.get("/explore", getExploreTweets);

export default router;

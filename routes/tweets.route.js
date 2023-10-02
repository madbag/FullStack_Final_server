import express from "express";
import { verifyToken } from "../verifyToken.js";
import {createTweet,
  deleteTweet,
  likeOrDislike,
  getAllTweets,
  getUserTweets,
  getExploreTweets,
} from "../controllers/tweet.js";

const router = express.Router();

// Create 
router.post("/", verifyToken, createTweet);

// Delete
router.delete("/:id", verifyToken, deleteTweet);

// Like or Dislike
router.put("/:id/like", likeOrDislike);

// get all tweets
router.get("/timeline/:id", getAllTweets);

// get our tweet
router.get("/user/all/:id", getUserTweets);

//explore
router.get("/explore", getExploreTweets);

export default router;
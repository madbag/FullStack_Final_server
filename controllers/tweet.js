import Tweet from "../models/Tweet.js";
import { handleError } from "../error.js";
import User from "../models/User.js";


//CREATE
export const createTweet = async (req, res, next) => {
  const newTweet = new Tweet(req.body);//description which is there in the model
  try {
    const savedTweet = await newTweet.save();
    res.status(200).json(savedTweet);
  } catch (err) {
    handleError(500, err);
  }
};

// DELETE
export const deleteTweet = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (tweet.userId === req.body.id) {  //if owner of the tweet matches the user of the tweet
      await tweet.deleteOne(); 
      res.status(200).json("tweet has been deleted");
    } else {
      handleError(500, err);
    }
  } catch (err) {
    handleError(500, err);
  }
};

// LIKE OR DISLIKE
export const likeOrDislike = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet.likes.includes(req.body.id)) {//if it doesn't include the user in the likes
      await tweet.updateOne({ $push: { likes: req.body.id } });
      res.status(200).json("tweet has been liked");
    } else {
      await tweet.updateOne({ $pull: { likes: req.body.id } });
      res.status(200).json("tweet has been disliked");
    }
  } catch (err) {
    handleError(500, err);
  }
};

//ALL TWEETS
export const getAllTweets = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.id);//people who we are following
    
    const userTweets = await Tweet.find({ userId: currentUser._id });//My Tweets
    const followersTweets = await Promise.all(
      currentUser.following.map((followerId) => {
        return Tweet.find({ userId: followerId });
      })
    );

    res.status(200).json(userTweets.concat(...followersTweets));
  } catch (err) {
    handleError(500, err);
  }
};

//OUR TWEETS
export const getUserTweets = async (req, res, next) => {
  try {
    const userTweets = await Tweet.find({ userId: req.params.id })
    .sort({
      createAt: -1, //latest tweet on the top, createdAt from the model
    });

    res.status(200).json(userTweets);
  } catch (err) {
    handleError(500, err);
  }
};

//Explore 
export const getExploreTweets = async (req, res, next) => {
  try {
    const getExploreTweets = await Tweet.find({
      likes: { $exists: true },
    }).sort({ likes: -1 });//most liked tweets on top

    res.status(200).json(getExploreTweets);
  } catch (err) {
    handleError(500, err);
  }
};
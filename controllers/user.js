// import { resolveSoa } from "dns";
import { handleError } from "../error.js";
import User from "../models/User.js";
import Tweet from "../models/Tweet.js"

//Find User
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

//Update User info
export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    //if user matches the id
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id, //find the user by id using params
        {
          $set: req.body, //set this to actual data
        },
        {
          new: true, //set to the newly obtained data
        }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(handleError(403, "You can only update your own account"));
  }
};

//Delete User
export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    //if user matches the id
    try {
      await User.findByIdAndDelete(req.params.id);//find the user and delete
      await Tweet.remove({userId: req.params.id});// find all the tweets made by the user and delete
      
      res.status(200).json("User Delete");
    } catch (err) {
      next(err);
    }
  } else {
    return next(handleError(403, "You can only update your own account"));
  }
};

//following 
export const follow = async (req, res, next) => {
  try {
    //user
    const user = await User.findById(req.params.id);
    //current user
    const currentUser = await User.findById(req.body.id); //loggedin user

    if (!user.followers.includes(req.body.id)) {
      await user.updateOne({
        $push: {
          followers: req.body.id,
        },
      });

      await currentUser.updateOne({
        $push: {
          following: req.params.id
        }
      })
    } else {
      res.status(403)
      .json("you already follow this user");
    }
    res.status(200).json("following the user");
  } catch (err) {
    next(err);
  }
};

//unfollow
export const unfollow = async (req, res, next) => {
  try {
    //user
    const user = await User.findById(req.params.id);
    //current user
    const currentUser = await User.findById(req.body.id); //loggedin user

    if (currentUser.following.includes(req.params.id)) {
      await user.updateOne({
        $pull: {
          followers: req.body.id,
        },
      });

      await currentUser.updateOne({
        $pull: {
          following: req.params.id
        }
      })
    } else {
      res.status(403)
      .json("you are not following this user");
    }
    res.status(200).json("Unfollowing the user");
  } catch (err) {
    next(err);
  }
};

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { handleError } from "../error.js";

export const signup = async (req, res, next) => {
  //   console.log(req.body);
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hashedPassword });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT);
    const { password, ...othersData } = newUser._doc; //mongodb value - unnecessary data not included

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(othersData);
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  //   console.log(req.body);
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(handleError(404, "User not found"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password); //password matching from the form and from the `findOne`
    if (!isCorrect) return next(handleError(400, "Wrong Password"));

    const token = jwt.sign({ id: user._id }, process.env.JWT);//if the password passes it gives token(cookie) otherwise !isCorrect
    console.log(token)
    const { password, ...othersData } = user._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200) //cookie to the browser and then to the database
      .json(othersData);
  } catch (err) {
    next(err);
  }
};

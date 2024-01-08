import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import tweetRoutes from "./routes/tweets.route.js";
import morgan from "morgan";

const app = express();
app.use(morgan("dev"));
const frontend_URL = process.env.ORIGIN || "http://localhost:3000";
dotenv.config();

const connect = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("connected to mongodb database");
    })
    .catch((err) => {
      throw err;
    });
};

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

app.use(cookieParser()); //the token will not read the token and it will run an error
app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000"] }));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tweets", tweetRoutes);

app.listen(8000, () => {
  connect();
  console.log("Listening to port 8000");  
});

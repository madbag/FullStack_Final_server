import express from "express";
import { signup, signin } from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", signup);
//code in the controller for better code reference
router.post("/signin", signin);

export default router;

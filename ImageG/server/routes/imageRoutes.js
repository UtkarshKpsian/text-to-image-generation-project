import express from "express";
import authUser from "../middlewares/auth.js";
import { generateImage } from "../controllers/imageController.js";

const imageRouter = express.Router()
imageRouter.post('/generate-image',authUser,generateImage)
export default imageRouter
import bcrypt from "bcryptjs";
import {  Router } from "express";
import { userController } from "./user.controller";


const router = Router()

router.post(("/register"), userController.RegisterUser)

export const userRouter = router;
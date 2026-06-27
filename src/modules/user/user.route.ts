import bcrypt from "bcryptjs";
import {  NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import { JwtPayload } from "jsonwebtoken";
import { auth } from "../../middleware/auth";


const router = Router()


router.post(("/register"), userController.RegisterUser)
router.get(("/me"),auth(Role.USER,Role.ADMIN,Role.ADMIN) ,userController.getMyProfile)

router.put("/my-profile", auth(Role.USER,Role.ADMIN,Role.AUTHOR), userController.updateMyProfile )

export const userRouter = router;
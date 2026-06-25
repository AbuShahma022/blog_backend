import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";

const RegisterUser = async (req:Request, res:Response) => {
   try {
     const payload = req.body;

     const user = await userService.RegisterUserDB(payload)

    res.status(httpStatus.CREATED).json({
        success: true,
        message: "User registered successfully",
        data: user
     });
   } catch (error) {
    console.error("Error registering user:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to register user"
    });
   }
}

export const userController = {
    RegisterUser
}
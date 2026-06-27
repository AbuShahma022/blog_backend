import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const payload = req.body;

    const {accessToken, refreshToken} = await authService.loginUser(payload);
   

    res.cookie("accessToken", accessToken, {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 days
    });

    res.cookie("refreshToken", refreshToken, {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });


  

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: {
            accessToken,
            refreshToken
        }
    })
    
})
export const authController = {
    loginUser
}
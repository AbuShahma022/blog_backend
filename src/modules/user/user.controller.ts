import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";




// const RegisterUser = async (req:Request, res:Response) => {
//    try {
//      const payload = req.body;

//      const user = await userService.RegisterUserDB(payload)

//     res.status(httpStatus.CREATED).json({
//         success: true,
//         message: "User registered successfully",
//         data: user
//      });
//    } catch (error) {
//     console.error("Error registering user:", error);
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: "Failed to register user"
//     });
//    }
// }



const RegisterUser = catchAsync(async (req:Request, res:Response,next:NextFunction)=>{
    const payload = req.body;
    const user = await userService.RegisterUserDB(payload)
    // res.status(httpStatus.CREATED).json({
    //     success: true,
    //     message: "User registered successfully",
    //     data: user
    //  });
    
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: {user}
    })


    })


const getMyProfile = catchAsync(async (req:Request, res:Response,next:NextFunction)=>{

    // const {accessToken} = req.cookies

    // const data=  jwtUtils.verifyToken(accessToken, config.jwt_access_secret)
    // if(typeof data === "string") throw new Error(data)

    const profile = await userService.getMyProfile(req.user?.id as string )

    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "User profile fetched successfully",
        data: {profile}
    })

   
    
    
})


const updateMyProfile = catchAsync(async (req:Request, res:Response,next:NextFunction)=>{

    const userId = req.user?.id as string
    const payload = req.body

    const updatedProfile = await userService.UpdateMyProfileInDB(userId, payload)

    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "User profile updated successfully",
        data: {updatedProfile}
    })
    
})


export const userController = {
    RegisterUser,
    getMyProfile,
    updateMyProfile
}
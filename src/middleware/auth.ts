import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

declare global {
    namespace Express {
        interface Request {
            user? : {
                name : string,
                role:Role,
                id: string,
                email: string
            }
        }
    }
}


export const auth = (...requireRole: Role[])=>{
  return  catchAsync(async (req:Request, res:Response, next: NextFunction)=>{
        const token =
           req.cookies.accessToken ? req.cookies.accessToken :
          req.headers.authorization?.startsWith("Bearer")
            ? req.headers.authorization?.split(" ")[1]
            : req.headers.authorization;


            if(!token) {
                throw new Error("You are not logged in.please login again to access")
            }

            const data=  jwtUtils.verifyToken(token, config.jwt_access_secret)

              if (!data.success){
                    throw new Error(data.error)
                 }
            
                const {email,role,id,name} = data.data as JwtPayload

                if (requireRole.length && !requireRole.includes(role)){
                    throw new Error ("Forbidden. you don't have permission to access")
                }

                const user = await prisma.user.findUnique({
                    where: {
                        id,
                        email,
                        name,
                        role
                    }
                })

                if (!user){
                    throw new Error("User not found")
                }

                if(user.activeStatus === "INACTIVE"){
                    throw new Error("User is inactive. please contact support")

                }

                req.user = {
                  name,
                  email,
                  role,
                  id,
                };

        next()


    })
}
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  
  const jwtPayload ={
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  }

//   const AccessToken = jwt.sign(jwtPayload,config.jwt_access_secret, {
//     expiresIn: config.jwt_access_expires_in,
//   } as SignOptions);

const AccessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions
)

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions
    );



  return {
    accessToken: AccessToken,
    refreshToken: refreshToken,
  };
};

export const authService = {
  loginUser,
};

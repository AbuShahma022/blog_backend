import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { RegisterUserPayload } from "./user.interface";


const RegisterUserDB = async (payload: RegisterUserPayload) => {
    const { name, email, password, profilePhoto } = payload;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashPassword = bcrypt.hashSync(password, config.bcryptSaltRounds);
    const createdUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });
    await prisma.profile.create({
      data: {
        userId: createdUser.id,
        profilePhoto,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: createdUser.id,
        email: createdUser.email || email,
      },
      omit: {
        password: true,
      },
      include: {
        profile: true,
      },
    });

    return user;
}

export const userService = {
    RegisterUserDB
}
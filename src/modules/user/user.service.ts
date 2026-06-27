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

const getMyProfile = async (userId: string) => {
    const profile = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId ,
        
        },
        omit: {
            password: true
        },
        include: {
            profile: true
        }
    })
    return profile

}

const UpdateMyProfileInDB = async (userId: string, payload:any)=>{
  const {name,profilePhoto,bio,email} = payload

  const updateUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      name,
      email,
      profile: {
        update: {
          profilePhoto,
          bio
        }
      }
    },

    omit: {
      password: true
    },
    include: {
      profile: true
    }
  })

return updateUser

}

export const userService = {
    getMyProfile,
    RegisterUserDB,
    UpdateMyProfileInDB
}
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(process.cwd(), ".env"),
});

 const config = {
    databaseUrl: process.env.DATABASE_URL ,
    app_url: process.env.APP_URL,
    port: process.env.PORT || 3000,
    bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ),
    jwt_access_secret: process.env.JWT_Access_Secret !,
    jwt_refresh_secret: process.env.JWT_Refresh_Secret !,
    jwt_access_expires_in: process.env.JWT_Access_Expire_in !,
    jwt_refresh_expires_in: process.env.JWT_Refresh_Expire_in !

};

export default config;
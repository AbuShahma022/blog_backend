import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from './config';
import { userRouter } from './modules/user/user.route';
import { authRoutes } from './modules/auth/auth.route';
import { postsRouter } from './modules/posts/posts.route';
import { commentRouter } from './modules/comment/comment.route';

const app:Application = express();
app.use(cors({
    origin: config.app_url,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.get('/', (req:Request, res:Response) => {
    res.send('Hello, World!');
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRoutes);
app.use("/api/posts",postsRouter);
app.use("/api/comments",commentRouter);

export default app; 
import { Router } from "express";
import { postsController } from "./posts.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.get("/", postsController.getAllPost)
router.get("/stats",auth(Role.ADMIN), postsController.getStats)
router.get("/my-posts",auth(Role.USER,Role.ADMIN,Role.AUTHOR), postsController.getMyPosts)
router.get("/:postId", postsController.getPostById)
router.post("/",auth(Role.USER,Role.ADMIN,Role.AUTHOR), postsController.CreatePost)
router.patch("/:postId",auth(Role.USER,Role.ADMIN,Role.AUTHOR), postsController.UpdatePost)
router.delete("/:postId",auth(Role.USER,Role.ADMIN,Role.AUTHOR), postsController.DeletePost)



export const postsRouter = router;
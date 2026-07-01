import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/author/:authorId",commentController.getCommentbyAuthorId)
router.get("/:postId",commentController.getCommentbyPostId)
router.post("/",auth(Role.USER,Role.ADMIN,Role.AUTHOR),commentController.CreateComment)
router.patch("/:commentId",auth(Role.USER,Role.ADMIN,Role.AUTHOR),commentController.UpdateComment)
router.put("/:commentId/moderate",auth(Role.ADMIN),commentController.ChangeCommentStatus)
router.delete("/:commentId",auth(Role.USER,Role.ADMIN,Role.AUTHOR),commentController.deleteComment)




export const commentRouter = router;
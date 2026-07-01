import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { commentService } from "./comment.service"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status"

const getCommentbyAuthorId = catchAsync(async(req:Request, res: Response, next : NextFunction)=>{
    const authorId = req.params.authorId
    const comment = await commentService.getCommentbyAuthorid(authorId as string)

       sendResponse(res,{
             statusCode: httpStatus.OK,
              success: true,
              message: "Comment fetched successfully",
              data: comment

    })



})


const getCommentbyPostId = catchAsync(async(req:Request, res: Response, next : NextFunction)=>{
    const postId = req.params.postId
    const comment = await commentService.getCommentbyPostId(postId as string)

       sendResponse(res,{
             statusCode: httpStatus.OK,
              success: true,
              message: "Comment fetched successfully",
              data: comment
       })

})


const CreateComment = catchAsync(async(req:Request, res: Response, next : NextFunction)=>{
    const authorId = req.user?.id
    const comment = await commentService.createComment(req.body,authorId as string)

    sendResponse(res,{
             statusCode: httpStatus.CREATED,
              success: true,
              message: "Comment created successfully",
              data: comment

    })

})


const UpdateComment = catchAsync(async(req:Request, res: Response, next : NextFunction)=>{
    const authorId = req.user?.id
    const commentId = req.params.commentId
    const comment = await commentService.updateComment(commentId as string,req.body,authorId as string)

       sendResponse(res,{
             statusCode: httpStatus.OK,
              success: true,
              message: "Comment updated successfully",
              data: comment

    })




})

const ChangeCommentStatus = catchAsync(async(req:Request, res: Response, next : NextFunction)=>{
    const commentId = req.params.commentId
    const comment = await commentService.changeCommentStatus(commentId as string,req.body)

        sendResponse(res,{
             statusCode: httpStatus.OK,
              success: true,
              message: "Comment status updated successfully",
              data: comment

    })

})

const deleteComment = catchAsync(async(req:Request, res: Response, next : NextFunction)=>{
    const authorId = req.user?.id
    const commentId = req.params.commentId

    const result = await commentService.deleteCommentbyId(commentId as string, authorId as string)


    
       sendResponse(res,{
             statusCode: httpStatus.OK,
              success: true,
              message: "Comment deleted successfully",
              data: result

    })

})



export const commentController = {
    getCommentbyAuthorId,
    getCommentbyPostId,
    CreateComment,
    UpdateComment,
    ChangeCommentStatus,
    deleteComment
}
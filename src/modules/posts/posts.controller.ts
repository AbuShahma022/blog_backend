import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PostService } from "./posts.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";

const getAllPost = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const result = await PostService.getAllPostFromDB()
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All posts fetched successfully",
        data: result
    })
})

const getStats = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{})

const getMyPosts = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const authorId = req.user?.id 

    const result = await PostService.getMyPostsFromDB(authorId as string)

    sendResponse(res,{
        success: true,
        statusCode:httpStatus.OK,
        message:"my post retrive successful",
        data: result
    })
})

const getPostById = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const id = req.params.postId

    if (!id) throw new Error("Post id is required")

    const result = await PostService.getPostByIdFromDB(id as string)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Post fetched successfully",
        data: result
    })
})

const CreatePost = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const userId = req.user?.id
    const payload = req.body

    const result = await PostService.CreatePostIntoDB(payload, userId as string)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Post created successfully",
        data: result
    })




})

const UpdatePost = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const authorId = req.user?.id
    const isAdmin = req.user?.role === "ADMIN"
    const postId = req.params.postId
    const payload = req.body

    const result = await PostService.UpdatePostFromDB(postId as string,payload,authorId as string, isAdmin)

    sendResponse (res,{
         statusCode: httpStatus.OK,
        success: true,
        message: "Post updated successfully",
        data: result
    })

})

const DeletePost = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const authorId = req.user?.id
    const isAdmin = req.user?.role === "ADMIN"
    const postId = req.params.postId

       const result = await PostService.DeletePostFromDB(postId as string,authorId as string, isAdmin)

    sendResponse (res,{
         statusCode: httpStatus.OK,
        success: true,
        message: "Post deleted successfully",
        data: result
    })


})






export const postsController = {
    getAllPost,
    getStats,
    getMyPosts,
    getPostById,
    CreatePost,
    UpdatePost,
    DeletePost
}
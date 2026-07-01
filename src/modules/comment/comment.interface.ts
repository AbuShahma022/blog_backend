import { CommentStatus } from "../../../generated/prisma/client";

export interface ICreateComment {
postId : string,
authorId : string,
content : string,

}


export interface IUpdateCommentPayload { 
    content ?: string, 
    status ?: CommentStatus
}


export interface IModerateCommentPayload {
    status: CommentStatus
}
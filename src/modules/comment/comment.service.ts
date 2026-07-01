import { prisma } from "../../lib/prisma"
import { ICreateComment, IModerateCommentPayload, IUpdateCommentPayload } from "./comment.interface"

const getCommentbyAuthorid = async (authorId: string)=>{
    const comments = await prisma.comment.findMany({
        where:{
            authorId
        },

        include:{
            post:{
                select:{
                    id: true,
                    title:true
                }
            },
           
        }
    })

    return comments
}

const getCommentbyPostId = async (postId:string)=>{
    const comments = await prisma.comment.findMany({
        where:{
            postId
        }
    })

    return comments


}

 
const createComment = async (payload:ICreateComment,authorId:string)=>{
await prisma.post.findUniqueOrThrow({
    where:{
        id: payload.postId
    }
})

const comment = await prisma.comment.create({
    data:{
        ...payload,
        authorId
    }
})

return comment

}

const updateComment = async (commentId:string,payload:IUpdateCommentPayload,authorId:string) =>{
    const commentData = await prisma.comment.findUniqueOrThrow({
        where:{
            id: commentId,
            authorId
        },
        select:{
            id: true
        }
     
    })

    const comment = await prisma.comment.update({
        where:{
            id:commentData.id,
            authorId
        },
        data:{
            ...payload
        }
    })

 return comment
}

const deleteCommentbyId = async (commentId:string,authorId:string)=>{
    const commentData = await prisma.comment.findUniqueOrThrow({
        where:{
            id: commentId,
            authorId
        }
    })

    const comment = await prisma.comment.delete({
        where:{
            id: commentData.id,
            authorId
        }
    })
    return comment
}

const changeCommentStatus = async (commentId: string, payload: IModerateCommentPayload) => {
    const commentData = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        }
    })

    if (commentData.status === payload.status){
        throw new Error(`Comment status is already ${commentData.status}`);
    }

    const comment = await prisma.comment.update({
        where:{
            id: commentData.id
        },
        data:{
            status: payload.status
        }
    })

}

export const commentService = {
    getCommentbyAuthorid,
    getCommentbyPostId,
    createComment,
    updateComment,
    deleteCommentbyId,
    changeCommentStatus
}
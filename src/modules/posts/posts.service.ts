import { CommentStatus, PostStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { ICreatePost, IUpdatePost } from "./posts.interface"

const getAllPostFromDB = async ()=>{

    const result = await prisma.post.findMany({
        include: {
            author: {
                omit: {
                    password: true
                }
            },

            comment: true
        }

       
    })
    return result

}

const getMyPostsFromDB = async( authorId: string )=>{
    const result = await prisma.post.findMany({
        where:{
            authorId
        },
        orderBy:{
            createdAt: 'desc'
        },
        include: {
            author:{
                omit:{
                    password:true
                }
            },
            comment: true,

            _count: {
                select:{
                    comment: true
                }
            }
        },

      

    })
    return result

}

const getPostByIdFromDB =async (PostId  : string)=>{
    // const result = await prisma.post.findUniqueOrThrow({

    //     where: {
    //         id : PostId
    //     }
    
    // })

    // const updatedPost = await prisma.post.update({
    //     where: {
    //         id: PostId
    //     },
    //     data: {
    //         views: {
    //             increment: 1
    //         },
            
    //     },
    //     include: {
    //         author: {
    //             omit: {
    //                 password: true
    //             }
    //         },
    //         comment: true
    //     }
    // })

    // return updatedPost

    const transactionResult = await prisma.$transaction(async(tx)=>{
        await tx.post.update({
            where: {
                id: PostId

            },   
            data: {
                views:{
                    increment: 1
                }
            }
        
        })

        const post = await prisma.post.findUnique({
            where:{
                id: PostId
            },
            include:{
                author:{
                    omit:{
                        password:true
                    }
                },

                comment:{
                    orderBy:{
                        createdAt:"desc"
                    }
                },

                _count:{
                    select:{
                        comment: true
                    }
                }
            },

            



        })
        return post

    })

    return transactionResult

}
const CreatePostIntoDB = async (payload: ICreatePost, userId: string)=>{

    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        }
    })

    return result

}

const UpdatePostFromDB = async (postId:string ,payload: IUpdatePost,authorId:string,isAdmin:boolean)=>{
    const post = await prisma.post.findUniqueOrThrow({
        where:{
           id: postId,

        }
    })

    if(!isAdmin && post.authorId !== authorId){
        throw new Error ("you are not owner of this post")
    }

    const result = await prisma.post.update({
        where:{
           id: postId
          },
          data: payload,

          include: {
            author:{
                omit:{
                    password:true
                }
            },
            comment: true,

           
          
        },
    })
return result
}


const DeletePostFromDB = async(postId:string,authorId:string,isAdmin:boolean)=>{
       const post = await prisma.post.findUniqueOrThrow({
        where:{
           id: postId,

        }
})
  if(!isAdmin && post.authorId !== authorId){
        throw new Error ("you are not owner of this post")
    }

    const result = prisma.post.delete({
        where: {
            id: postId
        }


    })
    return null
}


const getStatsFromDB = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      archivedPosts,
      totalComments,
      approvedComments,
      rejectedComments,
      totalViews,
    ] = await Promise.all([
      tx.post.count(),

      tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),

      tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),

     tx.post.count({
        where: {
          status: PostStatus.ARCHIVE,
        },
      }),

     await tx.comment.count(),

       tx.comment.count({
        where: {
          status: CommentStatus.APPROVE,
        },
      }),

       tx.comment.count({
        where: {
          status: CommentStatus.REJECTED,
        },
      }),

       tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      archivedPosts,
      totalComments,
      approvedComments,
      rejectedComments,
      totalViews: totalViews._sum.views ?? 0,
    };
  });

  return transactionResult;
};


export const PostService = {
    getAllPostFromDB,
    getMyPostsFromDB,
    getPostByIdFromDB,
    CreatePostIntoDB,
    UpdatePostFromDB,
    DeletePostFromDB,
    getStatsFromDB
}
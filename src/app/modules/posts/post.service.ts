/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import Post from './post.model';
import ApiError from '../../../errors/ApiError';
import { IPost } from './post.interface';
import QueryBuilder from '../../../builder/QueryBuilder';
import { IReqUser } from '../user/user.interface';
import Notification from '../notifications/notifications.model';
import { CustomRequest } from '../../../interfaces/common';

//! Add a post
const createPost = async (req: CustomRequest) => {
  const { files } = req;
  const data = req.body;
  const user = req.user;

  if (!data && !files?.image) {
    throw new Error('Data or image missing in the request body!');
  }

  let image = undefined;

  if (files && files.image) {
    image = `/images/image/${files.image[0].filename}`;
  }

  const result = await Post.create({
    image,
    user: user?.userId,
    ...data,
  });

  const notification = new Notification({
    user: user?.userId,
    title: 'New Post Created',
    message: 'Your new post has been created successfully.',
    type: 'user',
  });

  await notification.save();
  return result;
};
//! Get my posts
const getMyPosts = async (user: IReqUser, query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(
    Post.find({ user: user?.userId })
      .populate('user')
      .populate({
        path: 'comments',
        populate: [{ path: 'user', select: 'name profile_image' }],
      }),
    query,
  )
    .search(['title'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await postQuery.modelQuery;
  const meta = await postQuery.countTotal();

  return {
    meta,
    data: result,
  };
};
//! Community Post
const Posts = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(
    // user: { $ne: user?.userId }
    Post.find({})
      .populate('user')
      .populate({
        path: 'comments',
        populate: [{ path: 'user', select: 'name profile_image' }],
      }),
    query,
  )
    .search(['title'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await postQuery.modelQuery;
  const meta = await postQuery.countTotal();

  return {
    meta,
    data: result,
  };
};
//! Single Post
const singlePost = async (req: Request) => {
  const { id } = req.params;

  const result = await Post.findOne({ _id: id })
    .populate('user')
    .populate({
      path: 'comments',
      populate: [{ path: 'user', select: 'name profile_image' }],
    });

  if (!result) {
    throw new ApiError(404, 'Post not found');
  }

  return result;
};

//! Delete Post
const deletePost = async (id: string) => {
  const result = await Post.findById(id);
  if (!result) {
    throw new ApiError(404, 'Post not found');
  }
  return await Post.findByIdAndDelete(id);
};
//! Update post
const updatePost = async (id: string, req: CustomRequest) => {
  const { files } = req;
  const data = req?.body;
  const post = await Post.findById(id).populate('user');
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const { ...PostData } = data;

  let image = undefined;

  if (files && files.image) {
    image = `/images/image/${files.image[0].filename}`;
  }
  //@ts-ignore
  const updatedPostData: Partial<IPost> = { ...PostData };
  const result = await Post.findOneAndUpdate(
    { _id: id },
    {
      image,
      ...updatedPostData,
    },
    {
      new: true,
    },
  );
  return result;
};
//! Controller function to add a comment to a blog post
async function addComment(req: Request) {
  const { postId, content } = req.body;

  const { userId } = req.user as IReqUser;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  //@ts-ignore
  post.comments.push({ user: userId, content });
  // Create a notification after adding the comment
  const notification = new Notification({
    user: post.user,
    title: 'New Comment Added',
    message: 'Someone has commented on your post.',
    status: false,
    type: 'user',
  });

  await Promise.all([notification.save(), post.save()]);
  return post;
}
//! Controller function to delete a comment from a blog post
async function deleteComment(req: Request) {
  const { postId, commentId } = req.params;
  const posts = await Post.findById(postId);
  if (!posts) {
    throw new ApiError(404, 'Blog post not found');
  }
  // Find the index of the comment in the comments array
  const commentIndex = posts.comments.findIndex(
    //@ts-ignore
    comment => comment._id.toString() === commentId,
  );
  if (commentIndex === -1) {
    throw new ApiError(404, 'Comment not found');
  }
  // Remove the comment from the array
  posts.comments.splice(commentIndex, 1);
  await posts.save();
  return posts;
}

export const PostService = {
  createPost,
  getMyPosts,
  singlePost,
  deletePost,
  updatePost,
  addComment,
  deleteComment,
  Posts,
};

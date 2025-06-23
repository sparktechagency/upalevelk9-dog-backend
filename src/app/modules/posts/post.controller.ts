/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import { PostService } from './post.service';
import sendResponse from '../../../shared/sendResponse';
import { IReqUser } from '../user/user.interface';

const createPost = catchAsync(async (req: Request, res: Response) => {
  const result = await PostService.createPost(req as any);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post created successfully',
    data: result,
  });
});
const getMyPosts = catchAsync(async (req: Request, res: Response) => {
  const result = await PostService.getMyPosts(req.user as IReqUser, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My Post retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});
const Posts = catchAsync(async (req: Request, res: Response) => {
  const result = await PostService.Posts(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Community Post retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});
const singlePost = catchAsync(async (req: Request, res: Response) => {
  const result = await PostService.singlePost(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post retrieved successfully',
    data: result,
  });
});
const deletePost = catchAsync(async (req: Request, res: Response) => {
  await PostService.deletePost(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post delete successfully',
  });
});
const updatePost = catchAsync(async (req: Request, res: Response) => {
  const result = await PostService.updatePost(req.params.id, req as any);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post edit successfully',
    data: result,
  });
});
const addComment = catchAsync(async (req: Request, res: Response) => {
  const result = await PostService.addComment(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Comment add successfully',
    data: result,
  });
});
const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const result = await PostService.deleteComment(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post delete successfully',
    data: result,
  });
});

export const PostController = {
  createPost,
  getMyPosts,
  singlePost,
  deletePost,
  updatePost,
  addComment,
  deleteComment,
  Posts,
};

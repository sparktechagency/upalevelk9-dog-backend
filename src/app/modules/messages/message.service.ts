/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import Conversation from './conversation.model';
import Message from './message.model';
import User from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import { io } from '../../../socket/socket';
import httpStatus from 'http-status';
import { IReqUser } from '../user/user.interface';
import Admin from '../admin/admin.model';

//! One to one conversation
// const sendMessage = async (req: Request) => {
//   try {
//     // const { message } = req.body;
//     const { id: receiverId } = req.params;
//     const senderId = req.user?.userId;
//     const { files } = req;
//     const data = req.body;

//     const { message } = data;

//     const checkReceiverUser = await User.findById(receiverId);
//     const checkSenderUser = await User.findById(senderId);

//     if (checkReceiverUser === null || checkSenderUser === null) {
//       throw new ApiError(404, 'Sender or Receiver user not found');
//     }

//     let conversation = await Conversation.findOne({
//       participants: { $all: [senderId, receiverId] },
//       isGroup: false,
//     });
//     // console.log(conversation, 'conversation');
//     if (!conversation) {
//       conversation = await Conversation.create({
//         participants: [senderId, receiverId],
//       });
//     }
//     let image = undefined;

//     //@ts-ignore
//     if (files && files?.image) {
//       //@ts-ignore

//       image = `/images/image/${files.image[0].filename}`;
//     }
//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       message,
//       conversationId: conversation._id,
//       image,
//     });

//     if (newMessage) {
//       conversation.messages.push(newMessage._id);
//     }
//     await Promise.all([conversation.save(), newMessage.save()]);

//     if (conversation && newMessage) {
//       //@ts-ignore
//       io.to(receiverId).emit('getMessage', newMessage);
//     }

//     return newMessage;
//   } catch (error) {
//     //@ts-ignore
//     console.log('Error in sendMessage controller: ', error?.message);
//   }
// };
//!
const sendMessage = async (req: Request) => {
  const senderId = req.user?.userId;

  const { files } = req;
  const data = req.body;

  const { message, conversationId } = data;
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Token must be provide');
  }
  const checkSenderUser = await User.findById(senderId);
  const isAdmin = await Admin.findById(senderId);

  if (req?.user.role === 'user' && !checkSenderUser) {
    throw new ApiError(404, 'Sender not found');
  }
  if (req?.user.role === 'admin' && !isAdmin) {
    throw new ApiError(404, 'Sender not found');
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    isGroup: false,
  });

  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }
  let image = undefined;
  let messageType = '';
  //@ts-ignore
  if (files && files?.image) {
    //@ts-ignore
    image = `/images/image/${files.image[0].filename}`;
  }
  //@ts-ignore
  if (!message && files && files?.image) {
    messageType = 'image';
  }
  //@ts-ignore
  if (message && !files?.image) {
    messageType = 'text';
  }
  //@ts-ignore
  if (message && files?.image) {
    messageType = 'both';
  }
  const newMessage = new Message({
    senderId,
    message,
    conversationId: conversationId,
    image,
    messageType,
  });

  await Promise.all([conversation.save(), newMessage.save()]);

  if (conversation && newMessage) {
    // io.to(senderId).emit('getMessage', newMessage);
    io.to(conversationId).emit('getMessage', newMessage);
  }

  return newMessage;
};
//!
const getMessages = async (id: string, pages: string, limits: string) => {
  const page = Number(pages || 1);
  const limit = Number(limits || 10);
  const skip = (page - 1) * limit;

  const conversation = await Message.find({
    conversationId: id,
  })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Message.countDocuments({ conversationId: id });

  const totalPage = Math.ceil(total / limit);
  const messages = conversation;

  return {
    messages,
    meta: {
      page,
      limit,
      totalPage,
    },
  };
};
//!
const conversationUser = async (req: Request) => {
  const { userId } = req.user as IReqUser;

  // Check if the user exists
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new ApiError(404, 'User does not exist');
  }

  // Find conversations that include the user
  const result = await Conversation.find({
    participants: { $all: [userId] },
  });

  // Filter out the current user from participants in each conversation
  const participantIds = result
    .map(conversation =>
      conversation.participants.filter(user => user.toString() !== userId),
    )
    .flat();

  // Remove duplicate participant IDs
  const uniqueParticipantIds = [
    ...new Set(participantIds.map(id => id.toString())),
  ];

  // Fetch user details for the remaining participant IDs
  const users = await User.find({ _id: { $in: uniqueParticipantIds } });
  return users;
};

export const messageService = {
  sendMessage,
  getMessages,
  conversationUser,
};

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import Conversation from './conversation.model';
import Message from './message.model';
import User from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import { io } from '../../../socket/socket';
import httpStatus from 'http-status';
import { IReqUser } from '../user/user.interface';

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

  const { message } = data;

  const checkSenderUser = await User.findById(senderId);

  if (!checkSenderUser) {
    throw new ApiError(404, 'Sender not found');
  }

  const conversation = await Conversation.findOne({
    participants: { $all: [senderId] },
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
    conversationId: conversation._id,
    image,
    messageType,
  });

  // await (await newMessage.populate('senderId')).populate('conversationId');

  if (newMessage) {
    conversation.messages.push(newMessage._id);
  }
  await Promise.all([conversation.save(), newMessage.save()]);

  if (conversation && newMessage) {
    //@ts-ignore
    io.to(conversation?._id).emit('getMessage', newMessage);
  }

  return newMessage;
};
//!
const getMessages = async (req: Request, res: Response) => {
  const senderId = req.user?.userId;

  const conversation = await Conversation.findOne({
    participants: { $all: [senderId] },
    isGroup: false,
  }).populate('messages');

  if (!conversation) return res.status(200).json([]);

  const messages = conversation.messages;
  // io.emit('getMessages', messages);
  return messages;
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

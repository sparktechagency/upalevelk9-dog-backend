/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import Conversation from './conversation.model';
import Message from './message.model';
import User from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import { io } from '../../../socket/socket';

//! One to one conversation
const sendMessage = async (req: Request) => {
  try {
    // const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user?.userId;
    const { files } = req;
    const data = req.body;

    const { message } = data;

    const checkReceiverUser = await User.findById(receiverId);
    const checkSenderUser = await User.findById(senderId);

    if (checkReceiverUser === null || checkSenderUser === null) {
      throw new ApiError(404, 'Sender or Receiver user not found');
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
      isGroup: false,
    });
    // console.log(conversation, 'conversation');
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    let image = undefined;

    //@ts-ignore
    if (files && files?.image) {
      //@ts-ignore

      image = `/images/image/${files.image[0].filename}`;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      conversationId: conversation._id,
      image,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await Promise.all([conversation.save(), newMessage.save()]);

    if (conversation && newMessage) {
      //@ts-ignore
      io.to(receiverId).emit('getMessage', newMessage);
    }

    return newMessage;
  } catch (error) {
    //@ts-ignore
    console.log('Error in sendMessage controller: ', error?.message);
  }
};
//!
const getMessages = async (req: Request, res: Response) => {
  try {
    const { id: conversationId } = req.params;
    // const senderId = req.user?.userId;

    const conversation = await Conversation.findOne({
      _id: conversationId,
    }).populate('messages');

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;
    io.emit('getMessages', messages);
    return messages;
  } catch (error) {
    //@ts-ignore
    console.log('Error in getMessages controller: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
//!
const conversationUser = async (req: Request) => {
  const { id } = req.params;

  // Check if the user exists
  const isUserExist = await User.findById(id);
  if (!isUserExist) {
    throw new ApiError(404, 'User does not exist');
  }

  // Find conversations that include the user
  const result = await Conversation.find({
    participants: { $all: [id] },
  });

  // Filter out the current user from participants in each conversation
  const participantIds = result
    .map(conversation =>
      conversation.participants.filter(user => user.toString() !== id),
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

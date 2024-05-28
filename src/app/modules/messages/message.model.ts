import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    image: {
      type: String,
    },

    message: {
      type: String,
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'both'],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

const Message = mongoose.model('Message', messageSchema);

export default Message;

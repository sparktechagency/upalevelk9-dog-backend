import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';
import validator from 'validator';

const UserSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      unique: true,
      sparse: true,
      // required: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: 'Please provide a valid email address',
      },
    },
    phone_number: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'SUPER_ADMIN', 'USER'],
      default: 'USER',
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'others'],
      // required: true,
    },
    profile_image: {
      type: String,
    },
    cover_image: {
      type: String,
    },
    location: {
      type: String,
    },
    bio: {
      type: String,
    },
    education: {
      type: String,
    },
    language: {
      type: String,
    },
    relationship_status: {
      type: String,
    },
    have_kids: {
      type: String,
    },
    smoke: {
      type: String,
    },
    drink: {
      type: String,
    },
    height: {
      type: String,
    },
    body_type: {
      type: String,
    },
    eyes: {
      type: String,
    },
    looking_for: {
      type: String,
    },
    date_of_birth: {
      type: Date,
    },
    verifyCode: {
      type: String,
    },
    verifyExpire: {
      type: Date,
    },
    is_block: {
      type: Boolean,
      default: false,
    },
    plan_type: {
      type: String,
      enum: ['free', 'basic', 'gold', 'premium'],
      default: 'free',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// Create a unique index for phoneNumber field
// Check if User exists
UserSchema.statics.isUserExist = async function (
  email: string,
): Promise<Pick<IUser, '_id' | 'password' | 'phone_number' | 'role'> | null> {
  return await User.findOne(
    { email },
    {
      _id: 1,
      email: 1,
      password: 1,
      role: 1,
      phone_number: 1,
    },
  );
};

// Check password match
UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

// Hash the password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// Statics
const User = model<IUser, UserModel>('User', UserSchema);

export default User;

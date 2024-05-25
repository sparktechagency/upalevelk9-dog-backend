/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import bcrypt from 'bcrypt';
import ApiError from '../../../errors/ApiError';
import {
  IActivationRequest,
  IActivationToken,
  IRegistration,
  IReqUser,
  IUser,
} from './user.interface';
import User from './user.model';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { Request } from 'express';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from '../auth/auth.interface';
import { updateImageUrl } from '../../../utils/url-modifier';
import QueryBuilder from '../../../builder/QueryBuilder';
import { IGenericResponse } from '../../../interfaces/paginations';
import httpStatus from 'http-status';
import sendEmail from '../../../utils/sendEmail';
import { registrationSuccessEmailBody } from '../../../mails/user.register';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { sendResetEmail } from '../auth/sendResetMails';
import { userSearchableField } from './user.constants';

//!
//!
const registrationUser = async (payload: IRegistration) => {
  const { name, email, password } = payload;
  const user = {
    name,
    email,
    password,
  };

  const isEmailExist = await User.findOne({ email });
  if (isEmailExist) {
    throw new ApiError(400, 'Email already exist');
  }

  const activationToken = createActivationToken(user);
  const activationCode = activationToken.activationCode;
  const data = { user: { name: user.name }, activationCode };

  try {
    sendEmail({
      email: user.email,
      subject: 'Activate Your Account',
      html: registrationSuccessEmailBody(data),
    });
  } catch (error: any) {
    throw new ApiError(500, `${error.message}`);
  }
  return {
    activationToken: activationToken.token,
    user,
  };
};
//!
const createActivationToken = (user: IRegistration): IActivationToken => {
  const activationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    config.activation_secret as Secret,
    {
      expiresIn: '5m',
    },
  );
  return { token, activationCode };
};
//!
const activateUser = async (payload: IActivationRequest, token: any) => {
  const { activation_code } = payload;
  const activation_token = token.split(' ')[1];
  const newUser: { user: IUser; activationCode: string } = jwt.verify(
    activation_token,
    config.activation_secret as string,
  ) as { user: IUser; activationCode: string };
  if (newUser.activationCode !== activation_code) {
    throw new ApiError(400, 'Activation code is not valid');
  }
  const { name, email, password } = newUser.user;
  const existUser = await User.findOne({ email });
  if (existUser) {
    throw new ApiError(400, 'Email is already exist');
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  const accessToken = jwtHelpers.createToken(
    { userId: user._id, role: user.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  //Create refresh token
  const refreshToken = jwtHelpers.createToken(
    { userId: user._id, role: user.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );
  return {
    accessToken,
    refreshToken,
    // user,
  };
};
//!
const createUser = async (userData: IUser): Promise<IUser | null> => {
  const newUser = await User.create(userData);

  return newUser;
};
//!
const getAllUsers = async (
  query: Record<string, unknown>,
): Promise<IGenericResponse<IUser[]>> => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(userSearchableField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return {
    meta,
    data: result,
  };
};
//!
const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const updatedResult = {
    ...result.toObject(),
    profile_image: updateImageUrl(result.profile_image).replace(/\\/g, '/'),
  };
  return updatedResult;
};
//!
const updateProfile = async (
  id: string,
  req: Request,
): Promise<IUser | null> => {
  //@ts-ignore
  const { files } = req;
  const { userId } = req.user as IReqUser;
  const checkValidUser = await User.findById(userId);
  if (!checkValidUser) {
    throw new ApiError(404, 'You are not authorized');
  }
  let cover_image = undefined;
  //@ts-ignore
  if (files && files.cover_image) {
    //@ts-ignore
    cover_image = files.cover_image[0].path;
  }
  let profile_image = undefined;
  //@ts-ignore
  if (files && files.profile_image) {
    //@ts-ignore
    profile_image = files.profile_image[0].path;
  }

  //@ts-ignore
  const data = req.body;
  if (!data) {
    throw new Error('Data is missing in the request body!');
  }

  // const parsedData = JSON.parse(data);

  const isExist = await User.findOne({ _id: id });

  if (!isExist) {
    throw new ApiError(404, 'User not found !');
  }

  const { ...UserData } = data;

  const updatedUserData: Partial<IUser> = { ...UserData };

  const result = await User.findOneAndUpdate(
    { _id: id },
    { profile_image, cover_image, ...updatedUserData },
    {
      new: true,
    },
  );
  return result;
};
//!
const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id);

  return result;
};
//!
const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(404, 'User does not exist');
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(402, 'Password is incorrect');
  }

  //create access token & refresh token

  const { _id: userId, role } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  //Create refresh token
  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};
//!
const deleteMyAccount = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email);
  //@ts-ignore
  if (!isUserExist) {
    throw new ApiError(404, 'User does not exist');
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(402, 'Password is incorrect');
  }
  return await User.findOneAndDelete({ email });
};
//!
const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (err) {
    throw new ApiError(402, 'Invalid Refresh Token');
  }

  const { userId } = verifiedToken;

  // checking deleted user's refresh token
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new ApiError(403, 'User does not exist');
  }
  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist._id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};
//!
const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword,
): Promise<void> => {
  const { userId } = user as any;
  //@ts-ignore
  const { oldPassword, newPassword, confirmPassword } = payload;
  if (newPassword !== confirmPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'New and Confirm password not match',
    );
  }
  const isUserExist = await User.findOne({ _id: userId }).select('+password');
  if (!isUserExist) {
    throw new ApiError(404, 'User does not exist');
  }
  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(402, 'Old password is incorrect');
  }
  isUserExist.password = newPassword;
  isUserExist.save();
};
const resetCodes: { [email: string]: { code: string; expiry: Date } } = {};

//!
const forgotPass = async (payload: { email: string }) => {
  const user = (await User.findOne(
    { email: payload.email },
    { _id: 1, role: 1 },
  )) as any;

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist!');
  }

  let profile = null;
  if (user.role === ENUM_USER_ROLE.USER) {
    profile = await User.findOne({ _id: user?._id });
  }

  if (!profile) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Pofile not found!');
  }

  if (!profile.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email not found!');
  }

  const activationCode = forgetActivationCode();
  const expiryTime = new Date(Date.now() + 15 * 60 * 1000);

  // Store the reset code and its expiry time in the global object
  resetCodes[payload.email] = { code: activationCode, expiry: expiryTime };

  sendResetEmail(
    profile.email,
    `
      <div>
        <p>Hi, ${profile.name}</p>
        <p>Your password reset Code: ${activationCode}</p>
        <p>Thank you</p>
      </div>
  `,
  );
};
const forgetActivationCode = () => {
  const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
  return activationCode;
};
//!
const checkIsValidForgetActivationCode = async (payload: {
  code: string;
  email: string;
}) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist!');
  }

  // Retrieve the stored reset code and expiry time
  const storedCodeInfo = resetCodes[payload.email];

  if (!storedCodeInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Reset code not found!');
  }

  if (storedCodeInfo.code !== payload.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid reset code!');
  }

  const currentTime = new Date();
  if (currentTime > storedCodeInfo.expiry) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Reset code has expired!');
  }

  return { valid: true };
};

//!
const resetPassword = async (payload: {
  email: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const { email, newPassword, confirmPassword } = payload;
  if (newPassword !== confirmPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password didn't match");
  }
  const user = await User.findOne({ email }, { _id: 1 });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!');
  }

  // await jwtHelpers.verifyToken(token, config.jwt.secret as string);

  const password = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.updateOne({ email }, { password }, { new: true });
};

export const UserService = {
  createUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  registrationUser,
  loginUser,
  refreshToken,
  changePassword,
  updateProfile,
  forgotPass,
  resetPassword,
  activateUser,
  deleteMyAccount,
  checkIsValidForgetActivationCode,
};

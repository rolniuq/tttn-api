import { omit } from "lodash";
import { Request } from "express";
import bcrypt from "bcrypt";
import config from "../../config/Default";
import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import User, { UserDocument } from "../models/User.Model";

export const CreateUser = async (input: DocumentDefinition<UserDocument>) => {
  try {
    return await User.create(input);
  } catch (e) {
    throw new Error("Error create user");
  }
};

export const ValidatePassword = async ({
  email,
  password,
}: {
  email: UserDocument["email"];
  password: string;
}) => {
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return omit(user.toJSON(), "password");
};

export const FindUser = async (query: FilterQuery<UserDocument>) => {
  return await User.findOne(query).lean();
};

export const UpdateUser = async (
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions
) => {
  return await User.findOneAndUpdate(query, update, options);
}

export const GetUserID = async (req: Request) => {
  //@ts-ignore
  const email = req.user.email;
  const user = await FindUser({ email });
  const userID = user?._id;
  return userID;
}

export const GetRoleUserLogined = async (req: Request) => {
  const userID = await GetUserID(req);
  const user = await FindUser({ _id: userID });
  if (!user) {
    return null;
  }
  return user.role;
}

export const HashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(config.saltHashPassword);
  return bcrypt.hashSync(password, salt);
}

export const ComparePassword = (newPassword: string, cNewPassword: string) => {
  if (newPassword !== cNewPassword) {
    return false;
  }

  return true;
}

import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Cart, { CartDocument } from "../models/Cart.Model";

export const CreateCart = async (input: DocumentDefinition<CartDocument>) => {
  try {
    return await Cart.create(input);
  } catch (e) {
    throw new Error("Error create cart");
  }
};

export const FindCart = async (query: FilterQuery<CartDocument>) => {
  return await Cart.findOne(query).lean();
};

export const GetListCart = async (query: FilterQuery<CartDocument>) => {
  return await Cart.find(query);
}

export const UpdateCart = async (
  query: FilterQuery<CartDocument>,
  update: UpdateQuery<CartDocument>,
  options: QueryOptions
) => {
  return await Cart.findOneAndUpdate(query, update, options);
};

export const DeleteCartByID = async (query: FilterQuery<CartDocument>) => {
  return await Cart.deleteOne(query);
}

export const DeleteAllCart = async (query: FilterQuery<CartDocument>) => {
  return await Cart.deleteMany(query);
};

export const GetPriceBySize = (size: string) => {
  if (size === "S") {
    return 0;
  }
  if (size === "M") {
    return 5000;
  }
  return 10000;
}

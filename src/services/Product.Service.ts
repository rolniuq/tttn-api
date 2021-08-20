import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import Product, { ProductDocument } from "../models/Product.Model";
import { Request } from "express";

export const CreateProduct = async (
  input: DocumentDefinition<ProductDocument>
) => {
  try {
    return Product.create(input);
  } catch (e) {
    throw new Error("Error create product");
  }
};

export const FindProduct = async (query: FilterQuery<ProductDocument>) => {
  return await Product.findOne(query).lean();
};

export const GetListProduct = async (query: FilterQuery<ProductDocument>) => {
  return await Product.find(query);
};

export const GetListProductSortedByName = async (by: number) => {
  return await Product.aggregate([{ $sort: { name: by } }]);
};

export const GetListProductSortedByPrice = async (by: number) => {
  return await Product.aggregate([{ $sort: { price: by } }]);
};

export const UpdateProduct = async (
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>,
  options: QueryOptions
) => {
  return Product.findOneAndUpdate(query, update, options);
};

export const DeleteProduct = async (query: FilterQuery<ProductDocument>) => {
  return await Product.findOneAndDelete(query);
};

export const GetProductID = async (req: Request) => {
  const _id = req.body.product;
  const product = await FindProduct({ _id });
  if (!product) {
    return null;
  }
  return _id;
};

export const TypeIsSuitable = (type: string) => {
  if (type !== "increment" && type !== "decrement") {
    return false;
  }
  return true;
}

export const GetTypeSort = (type: string) => {
  if (type === "increment" ) {
    return 1;
  }
  return -1;
}

import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import OrderDetail, { OrderDetailDocument } from "../models/OrderDetail.Model";

export const CreateOrderDetail = async (
  input: DocumentDefinition<OrderDetailDocument>
) => {
  try {
    return await OrderDetail.create(input);
  } catch (e) {
    throw new Error("Create orderdetail has failed");
  }
};

export const FindOrderDetails = async (
  query: FilterQuery<OrderDetailDocument>
) => {
  //@ts-ignore
  return await OrderDetail.findOne(query);
};

export const GetListOrderDetails = async (
  query: FilterQuery<OrderDetailDocument>
) => {
  //@ts-ignore
  return await OrderDetail.find(query);
};

export const UpdateOrderDetail = async (
  query: FilterQuery<OrderDetailDocument>,
  update: UpdateQuery<OrderDetailDocument>,
  option: QueryOptions
) => {
  //@ts-ignore
  return await OrderDetail.findOneAndUpdate(query, update, option);
};

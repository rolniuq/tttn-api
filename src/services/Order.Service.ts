import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import Order, { OrderDocument } from "../models/Order.Model";
import Common from "../utils/Common";

export const CreateOrder = async (input: DocumentDefinition<OrderDocument>) => {
  try {
    return await Order.create(input);
  } catch (e) {
    throw new Error("Error create Order");
  }
};

export const FindOrder = async (query: FilterQuery<OrderDocument>) => {
  return await Order.findOne(query).lean();
};

export const GetListOrder = async (query: FilterQuery<OrderDocument>) => {
  return await Order.find(query);
};

export const UpdateOrder = async (
  query: FilterQuery<OrderDocument>,
  update: UpdateQuery<OrderDocument>,
  options: QueryOptions
) => {
  return await Order.findOneAndUpdate(query, update, options);
};

export const GetListOrderID = async (query: FilterQuery<OrderDocument>) => {
  return await Order.find(query).select("_id");
};

export const CheckStatusUpdated = (status: string) => {
  if (
    !status ||
    (status !== Common.status.WAITING && status !== Common.status.SHIPPING)
  ) {
    return false;
  }
  return true;
}

export const ReturnStatusUpdated = (status: string) => {
  if (status === Common.status.UNCONFIRMED) {
    return Common.status.WAITING;
  }
  if (status === Common.status.WAITING) {
    return Common.status.SHIPPING;
  }
  if (status === Common.status.SHIPPING) {
    return Common.status.SHIPPED;
  }
  return undefined;
}

export const StatisticOrderByMonth = async () => {
  return await Order.aggregate([
    {
      $project: {
        month: { $month: "$requiredDate" },
        total: "$total",
      },
    },
  ]);
};

export const StatisticOrderByUserID = async (userID: string) => {
  return await Order.aggregate([
    {
      $match: { user: userID },
    },
    {
      $project: {
        month: { $month: "$requiredDate" },
        total: "$total",
      },
    },
  ]);
};

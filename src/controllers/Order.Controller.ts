import { Request, Response } from "express";
import { GetImagesByProductID } from "../services/Image.Service";
import { OrderDetailDocument } from "../models/OrderDetail.Model";
import {
  CreateOrderDetail,
  UpdateOrderDetail,
  GetListOrderDetails,
} from "../services/OrderDetail.Service";
import {
  CreateOrder,
  FindOrder,
  GetListOrder,
  GetListOrderID,
  UpdateOrder,
  ReturnStatusUpdated,
  StatisticOrderByMonth,
  StatisticOrderByUserID,
} from "../services/Order.Service";
import { FindUser, GetUserID } from "../services/User.Service";
import Common from "../utils/Common";
import { get } from "lodash";
import { FindProduct } from "../services/Product.Service";
import { GetPriceBySize } from "../services/Cart.Service";

export const CreateOrderHandler = async (req: Request, res: Response) => {
  const userID = await GetUserID(req);
  const order = await CreateOrder({ ...req.body, user: userID });

  const orderID = order._id;
  const dataOrderDetails = req.body.orderDetails;

  const priceDetails = await CreateOrderDetailHandler(
    dataOrderDetails,
    orderID
  );

  const total = priceDetails + order.shipFee;
  let result = await UpdateOrder(
    { _id: orderID },
    { total: total },
    { new: true }
  );

  //@ts-ignore
  result = { ...order._doc, orderDetails: { ...dataOrderDetails } };

  return res.status(200).json({ result });
};

export const GetListOrderHandler = async (req: Request, res: Response) => {
  const listOrders = await GetListOrder({});
  if (!listOrders) {
    return res.status(404).json({ message: "NO ORDERS HAVE FOUND" });
  }

  let result: any = [];

  const arrOrders = Object.values(listOrders);
  for (let i = 0; i < arrOrders.length; i++) {
    const orderID = arrOrders[i]._id;
    const order = await FindOrder({ _id: orderID });
    const details = await GetListOrderDetails({ order: orderID });

    if (!order) return res.status(404).json({ message: "ORDER HAS NOT FOUND" });
    order.updatedBy = await FindUser({ _id: order.updatedBy });

    result = [...result, { ...order, orderDetails: [...details] }];
  }

  return res.status(200).json({ result });
};

export const GetListOrderOfOneHandler = async (req: Request, res: Response) => {
  const userID = await GetUserID(req);
  const listOrderIDs = await GetListOrderID({ user: userID });

  if (!listOrderIDs || listOrderIDs.length === 0) {
    return res.status(404).json({ message: "LIST ORDERS HAVE NOT FOUND" });
  }

  const result = await BodyGetListOrderForUser(listOrderIDs);

  return res.status(200).json({ result });
};

export const GetListOrderTrackingByStatusHandler = async (
  req: Request,
  res: Response
) => {
  const status = get(req, "params.status");
  if (!status) {
    return res.status(400).json({ message: "ORDER STATUS IS REQUIRED" });
  }

  const userID = await GetUserID(req);

  const listOrderIDs = await GetListOrderID({ user: userID, status: status });
  if (!listOrderIDs) {
    return res.status(404).json({ message: "LIST ORDER IS EMPTY" });
  }

  const result = await BodyGetListOrderForUser(listOrderIDs);

  return res.status(200).json({ result });
};

export const GetListOrderByStatusHandler = async (
  req: Request,
  res: Response
) => {
  const status = get(req, "params.status");
  if (!status) {
    return res.status(400).json({ message: "STATUS IS REQUIRED" });
  }

  const listOrders = await GetListOrder({ status: status });
  if (!listOrders) {
    return res.status(404).json({ message: "NO ORDERS HAVE FOUND" });
  }

  const arrOrders = Object.values(listOrders);
  const result = await BodyGetListOrderForUser(arrOrders);

  return res.status(200).json({ result });
};

export const ConfirmOrderHandler = async (req: Request, res: Response) => {
  const orderID = get(req, "params.id");
  if (!orderID) {
    return res.status(400).json({ message: "ID ORDER IS REQUIRED" });
  }

  const order = await FindOrder({ _id: orderID });
  if (!order) {
    return res.status(404).json({ message: "ORDER HAS NOT FOUND" });
  }

  const orderStatus = order.status;
  if (orderStatus !== Common.status.UNCONFIRMED) {
    return res.status(400).json({ message: "CAN'T UPDATE STATUS THIS ORDER" });
  }

  const EditerLogined = await GetUserID(req);

  const result = await UpdateOrder(
    { _id: orderID },
    { status: Common.status.WAITING, updatedBy: EditerLogined },
    { new: false }
  );

  return res.status(200).json({ result });
};

export const CancelOrderHandler = async (req: Request, res: Response) => {
  const orderID = get(req, "params.id");
  if (!orderID) {
    return res.status(400).json({ message: "ID ORDER IS REQUIRED" });
  }

  const order = await FindOrder({ _id: orderID });
  if (!order) {
    return res.status(404).json({ message: "ORDER HAS NOT FOUND" });
  }

  const orderStatus = order.status;
  if (orderStatus !== Common.status.WAITING) {
    return res.status(400).json({ message: "CAN'T CANCEL THIS ORDER" });
  }

  const result = await UpdateOrder(
    { _id: orderID },
    { status: Common.status.CANCELED },
    { new: false }
  );

  return res.status(200).json({ result });
};

export const UpdateStatusOrderHandler = async (req: Request, res: Response) => {
  const orderID = get(req, "params.id");
  if (!orderID) {
    return res.status(400).json({ message: "ID ORDER IS REQUIRED" });
  }

  const order = await FindOrder({ _id: orderID });
  if (!order) {
    return res.status(404).json({ message: "ORDER HAS NOT FOUND" });
  }

  if (
    order.status !== Common.status.UNCONFIRMED &&
    order.status !== Common.status.WAITING &&
    order.status !== Common.status.SHIPPING
  ) {
    return res
      .status(400)
      .json({ message: "THIS ORDER IS NOT ALLOWED UPDATE" });
  }

  const statusUpdated = ReturnStatusUpdated(order.status);

  const EditerLogined = await GetUserID(req);

  const result = await UpdateOrder(
    { _id: orderID },
    { status: statusUpdated, updatedBy: EditerLogined },
    { new: false }
  );
  return res.status(200).json({ result });
};

export const StatisticOrderByMonthHandler = async (
  req: Request,
  res: Response
) => {
  const statistic = await StatisticOrderByMonth();
  let result: any = [
    { month: 1, total: 0 },
    { month: 2, total: 0 },
    { month: 3, total: 0 },
    { month: 4, total: 0 },
    { month: 5, total: 0 },
    { month: 6, total: 0 },
    { month: 7, total: 0 },
    { month: 8, total: 0 },
    { month: 9, total: 0 },
    { month: 10, total: 0 },
    { month: 11, total: 0 },
    { month: 12, total: 0 },
  ];

  for (let i = 0; i < statistic.length; i++) {
    result[statistic[i].month - 1].total =
      result[statistic[i].month - 1].total + statistic[i].total;
  }

  return res.status(200).json({ result });
};

export const StatisticOrderByUserIDHandler = async (
  req: Request,
  res: Response
) => {
  const userID = await GetUserID(req);
  const statistic = await StatisticOrderByUserID(userID);
  let result: any = [
    { month: 1, total: 0 },
    { month: 2, total: 0 },
    { month: 3, total: 0 },
    { month: 4, total: 0 },
    { month: 5, total: 0 },
    { month: 6, total: 0 },
    { month: 7, total: 0 },
    { month: 8, total: 0 },
    { month: 9, total: 0 },
    { month: 10, total: 0 },
    { month: 11, total: 0 },
    { month: 12, total: 0 },
    { totalBought: 0 },
  ];

  let totalBought = 0;
  for (let i = 0; i < statistic.length; i++) {
    result[statistic[i].month - 1].total =
      result[statistic[i].month - 1].total + statistic[i].total;
    totalBought = totalBought + statistic[i].total;
  }
  result[result.length - 1].totalBought = totalBought;

  return res.status(200).json({ result });
};

export const CreateOrderDetailHandler = async (
  data: Array<OrderDetailDocument>,
  orderID: string
) => {
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    const orderDetail = {
      order: orderID,
      product: data[i].product,
      quantity: data[i].quantity,
      size: data[i].size,
      note: data[i].note,
    };
    //@ts-ignore
    const detail = await CreateOrderDetail(orderDetail);

    const product = await FindProduct({ _id: data[i].product });
    const price =
      (product.price + GetPriceBySize(data[i].size)) * data[i].quantity;
    await UpdateOrderDetail(
      { _id: detail._id },
      { price: price },
      { new: true }
    );
    total = total + price;
  }
  return total;
};

const BodyGetListOrderForUser = async (listOrderIDs: any[]) => {
  let result: any = [];
  for (let i = 0; i < listOrderIDs.length; i++) {
    const order = await FindOrder({ _id: listOrderIDs[i] });
    let details: any = await GetListOrderDetails({ order: listOrderIDs[i] });
    for (let i = 0; i < details.length; i++) {
      //@ts-ignore
      const product = await FindProduct({ _id: details[i].product });
      const images = await GetImagesByProductID({
        product: details[i].product,
      });
      details[i] = {
        ...details[i]._doc,
        product: { ...product, images: images },
      };
    }

    result = [...result, { ...order, orderDetails: [...details] }];
  }

  return result;
};

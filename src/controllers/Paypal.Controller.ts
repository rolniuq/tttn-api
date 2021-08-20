import { Request, Response } from "express";
import paypal from "paypal-rest-sdk";
import {
  CreateOrder,
  FindOrder,
  UpdateOrder,
} from "./../services/Order.Service";
import { PaypalDocument, PaypalProps } from "../models/Paypal.Model";
import { ProductDocument } from "../models/Product.Model";
import { FindProduct } from "../services/Product.Service";
import { GetPriceBySize } from "../services/Cart.Service";
import { FindUser, GetUserID } from "../services/User.Service";
import { CreateOrderDetailHandler } from "./Order.Controller";
import { CreatePaypal, GetListPaypal } from "../services/Paypal.Service";
import { GetListOrderDetails } from "../services/OrderDetail.Service";
import { GetImagesByProductID } from "../services/Image.Service";

const getTotal = async (res: Response, items: Array<PaypalProps>) => {
  let total: number = 0;
  for (let i = 0; i < items.length; i++) {
    const product: ProductDocument = await FindProduct({
      _id: items[i].product,
    });
    if (!product) {
      return res.status(400).json({ message: "PRODUCT HAS NOT FOUND" });
    }
    total +=
      (product.price + GetPriceBySize(items[i].size)) * items[i].quantity;
  }
  return (Math.round((total / 23000) * 100) / 100).toFixed(2);
};

const addNameIntoItems = async (res: Response, items: Array<PaypalProps>) => {
  let result = [];
  for (let i = 0; i < items.length; i++) {
    const product: ProductDocument = await FindProduct({
      _id: items[i].product,
    });
    if (!product) {
      return res.status(400).json({ message: "PRODUCT HAS NOT FOUND" });
    }
    const item = {
      name: product.name,
      price: (parseInt((product.price / 23000).toString()) + 1).toString(),
      currency: "USD",
      quantity: parseInt(items[i].quantity.toString()),
    };
    result.push(item);
  }

  return result;
};

export const CreatePaypalHandler = async (req: Request, res: Response) => {
  const userID = await GetUserID(req);
  const user = await FindUser({ _id: userID });
  const infoGuest = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    phone: user?.phone,
    address: user?.address,
  };

  const orderID = req.body.orderID;
  const orderDetails = req.body.orderDetails;

  const order: any = await CreateOrder({ ...req.body, infoGuest, user: userID });
  const priceDetails = await CreateOrderDetailHandler(orderDetails, order._id);

  await CreatePaypal({ ...req.body, order: order._id, user: userID });

  const total = priceDetails + order.shipFee;
  let result: any = await UpdateOrder(
    { _id: order._id },
    { total: total },
    { new: true }
  );

  result = {
    ...order._doc,
    orderID: orderID,
    orderDetails: { ...orderDetails },
  };

  return res.status(200).json({ result });
};

export const CapturePaypalHandler = (req: Request, res: Response) => {
  const orderID = req.body.id;
  paypal.payment.get(orderID, {}, (error, payment) => {});
};

export const GetPricePaypalHandler = async (req: Request, res: Response) => {
  const items = req.body.list;
  const total = await getTotal(res, items);
  return res.status(200).json({ result: total });
};

export const GetListPaypalHandler = async (req: Request, res: Response) => {
  const paypals = await GetListPaypal({});
  const result = await BodyGetListOrderByListPaypal(res, paypals);

  return res.status(200).json({ result });
};

const BodyGetListOrderByListPaypal = async (res: Response, paypals: PaypalDocument[]) => {
  let result: any = [];
  for (let i = 0; i < paypals.length; i++) {
    const orderID = paypals[i].orderID;
    const order = await FindOrder({ _id: paypals[i].order });
    const orderDetails = await BodyGetListProductByOrderDetails(
      res,
      paypals[i].order
    );
    result = [...result, { orderID, order, orderDetails }];
  } 
  return result;
};

const BodyGetListProductByOrderDetails = async (res: Response, orderID: string) => {
  let result: any = await GetListOrderDetails({ order: orderID });
  for (let i = 0; i < result.length; i++) {
    const product = await FindProduct({ _id: result[i].product });
    if (!product) {
      return res.status(404).json({ message: "PRODUCT HAS NOT FOUND" });
    }
    const images = await GetImagesByProductID({
      product: result[i].product,
    });
    result[i] = { ...result[i]._doc, product: { ...product, images: images } };
  }

  return result;
};

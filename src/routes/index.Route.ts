import { Express } from "express";
import UserRoute from "./User.Route";
import ProductRoute from "./Product.Route";
import CategoryRoute from "./Category.Route"; 
import CartRoute from "./Cart.Route";
import OrderRoute from "./Order.Route";
import ImageRoute from "./Image.Route";
import PaypalRoute from "./Paypal.Route";

const InitialRoute = (app: Express) => {
  UserRoute(app);
  ProductRoute(app);
  CategoryRoute(app);
  CartRoute(app);
  OrderRoute(app);
  ImageRoute(app);
  PaypalRoute(app);
}

export default InitialRoute;

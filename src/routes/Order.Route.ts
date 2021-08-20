import { Express } from "express";
import {
  ConfirmOrderHandler,
  CreateOrderHandler,
  GetListOrderHandler,
  GetListOrderByStatusHandler,
  CancelOrderHandler,
  StatisticOrderByMonthHandler,
  UpdateStatusOrderHandler,
  StatisticOrderByUserIDHandler,
  GetListOrderTrackingByStatusHandler,
  GetListOrderOfOneHandler,
} from "../controllers/Order.Controller";
import {
  VerifyLogin,
  RequireStaff,
  RequireAdmin,
} from "../middleware/Authentication";
import ValidateRequest from "../middleware/ValidateRequest";
import { CreateOrderSchema } from "../schema/Order.Schema";

const OrderRoute = (app: Express) => {
  app.get("/order", VerifyLogin, GetListOrderOfOneHandler);
  app.get("/orders", VerifyLogin, RequireStaff, GetListOrderHandler);
  app.get(
    "/orders/tracking/:status",
    VerifyLogin,
    GetListOrderTrackingByStatusHandler
  );
  app.get("/statistic", VerifyLogin, StatisticOrderByUserIDHandler);
  app.get(
    "/orders/:status",
    VerifyLogin,
    RequireStaff,
    GetListOrderByStatusHandler
  );
  app.get(
    "/statistic/month",
    VerifyLogin,
    RequireAdmin,
    StatisticOrderByMonthHandler
  );

  app.post(
    "/order",
    VerifyLogin,
    RequireStaff,
    ValidateRequest(CreateOrderSchema),
    CreateOrderHandler
  );
  app.post("/order/cancel/:id", VerifyLogin, CancelOrderHandler);
  app.post(
    "/order/confirm/:id",
    VerifyLogin,
    RequireStaff,
    ConfirmOrderHandler
  );
  app.post(
    "/order/update/:id",
    VerifyLogin,
    RequireStaff,
    UpdateStatusOrderHandler
  );
};

export default OrderRoute;

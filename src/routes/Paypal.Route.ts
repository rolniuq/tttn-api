import { Express } from "express";
import { RequireStaff, VerifyLogin } from "./../middleware/Authentication";
import {
  CapturePaypalHandler,
  CreatePaypalHandler,
  GetListPaypalHandler,
  GetPricePaypalHandler,
} from "../controllers/Paypal.Controller";
import ValidateRequest from "../middleware/ValidateRequest";
import {
  CapturePaypalSchema,
  CreatePaypalSchema,
  GetPricePaypalSchema,
} from "../schema/Paypal.Schema";

const PaypalRoute = (app: Express) => {
  app.get("/paypals", VerifyLogin, RequireStaff, GetListPaypalHandler);

  app.post(
    "/paypal/capture",
    VerifyLogin,
    ValidateRequest(CapturePaypalSchema),
    CapturePaypalHandler
  );
  app.post(
    "/paypal/price",
    VerifyLogin,
    ValidateRequest(GetPricePaypalSchema),
    GetPricePaypalHandler
  );
  app.post(
    "/paypal",
    VerifyLogin,
    ValidateRequest(CreatePaypalSchema),
    CreatePaypalHandler
  );
};

export default PaypalRoute;

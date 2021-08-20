import {
  DeleteListCartByIDHandler,
  UpdateCartByIDHander,
} from "../controllers/Cart.Controller";
import { Express } from "express";
import {
  CreateCartHandler,
  DeleteAllCartHandler,
  DeleteCartByIDHandler,
  GetAllCartHandler,
  GetCartPriceSelectedHandler,
} from "../controllers/Cart.Controller";
import { VerifyLogin } from "../middleware/Authentication";
import ValidateRequest from "../middleware/ValidateRequest";
import {
  CreateCartSchema,
  DeleteListCartByID,
  GetCartPriceSelectedSchema,
  UpdateCartSchema,
} from "../schema/Cart.Schema";

const CartRoute = (app: Express) => {
  app.get("/carts", GetAllCartHandler);

  app.post(
    "/cart/price",
    ValidateRequest(GetCartPriceSelectedSchema),
    GetCartPriceSelectedHandler
  );
  app.post(
    "/cart",
    ValidateRequest(CreateCartSchema),
    CreateCartHandler
  );
  app.post(
    "/cart/delete/list",
    VerifyLogin,
    ValidateRequest(DeleteListCartByID),
    DeleteListCartByIDHandler
  );

  app.put(
    "/cart",
    ValidateRequest(UpdateCartSchema),
    UpdateCartByIDHander
  );

  app.delete("/cart/:id", DeleteCartByIDHandler);
  app.delete("/cart/all", VerifyLogin, DeleteAllCartHandler);
};

export default CartRoute;

import { Express } from "express";
import {
  CreateProductHandler,
  DeleteProductByIDHandler,
  GetListProductHandler,
  GetProductByIDHandler,
  UpdateProductHandler,
  GetListProductsSortedByNameHandler,
  GetListProductsByCategoryHandler,
  GetListProductSortByPriceHandler,
  GetListProductForOrderHandler,
} from "../controllers/Product.Controller";
import { VerifyLogin, RequireStaff } from "../middleware/Authentication";
import ValidateRequest from "../middleware/ValidateRequest";
import {
  CreateProductSchema,
  GetListProductForOrder,
  GetListProductSortedSchema,
} from "../schema/Product.Schema";

const ProductRoute = (app: Express) => {
  app.get("/product/:id", GetProductByIDHandler);
  app.get("/products", GetListProductHandler);
  app.get("/products/:category", GetListProductsByCategoryHandler);

  app.post(
    "/product",
    VerifyLogin,
    RequireStaff,
    ValidateRequest(CreateProductSchema),
    CreateProductHandler
  );
  app.post(
    "/products/sort/name",
    ValidateRequest(GetListProductSortedSchema),
    GetListProductsSortedByNameHandler
  );
  app.post(
    "/products/sort/price",
    ValidateRequest(GetListProductSortedSchema),
    GetListProductSortByPriceHandler
  );
  app.post(
    "/products/order",
    VerifyLogin,
    ValidateRequest(GetListProductForOrder),
    GetListProductForOrderHandler
  );

  app.put(
    "/product/:id",
    VerifyLogin,
    RequireStaff,
    ValidateRequest(CreateProductSchema),
    UpdateProductHandler
  );

  app.delete(
    "/product/:id",
    VerifyLogin,
    RequireStaff,
    DeleteProductByIDHandler
  );
};

export default ProductRoute;

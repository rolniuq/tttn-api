import { Express } from "express";
import {
  CreateCategoryHandler,
  GetListCategoryHandler,
  DeleteCategoryByIDHandler,
  UpdateCategoryHandler,
  GetCategoryHandler,
  GetListCategorySortedByNameHandler,
} from "../controllers/Category.Controller";
import { VerifyLogin, RequireStaff } from "../middleware/Authentication";
import ValidateRequest from "../middleware/ValidateRequest";
import {
  CreateCategorySchema,
  GetListCategorySortedSchema,
} from "../schema/Category.Schema";

const CategoryRoute = (app: Express) => {
  app.get("/category/:id", VerifyLogin, GetCategoryHandler);
  app.get("/categories", GetListCategoryHandler);

  app.post(
    "/categories/sort",
    ValidateRequest(GetListCategorySortedSchema),
    GetListCategorySortedByNameHandler
  );
  app.post(
    "/category",
    VerifyLogin,
    RequireStaff,
    ValidateRequest(CreateCategorySchema),
    CreateCategoryHandler
  );

  app.put(
    "/category/:id",
    VerifyLogin,
    RequireStaff,
    ValidateRequest(CreateCategorySchema),
    UpdateCategoryHandler
  );

  app.delete(
    "/category/:id",
    VerifyLogin,
    RequireStaff,
    DeleteCategoryByIDHandler
  );
};

export default CategoryRoute;

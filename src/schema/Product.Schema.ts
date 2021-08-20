import { object, string, number, array } from "yup";

export const CreateProductSchema = object({
  body: object({
    name: string()
      .required("Name product is required")
      .min(2, "Name product must be included 2 character"),
    price: number()
      .required("Price product is required")
      .min(0, "Min price product is 0"),
    description: string(),
    category: string().required("Category product is required"),
  }),
});

export const GetListProductByCategorySchema = object({
  body: object({
    type: string().required("Type category is required"),
  }),
});

export const GetListProductSortedSchema = object({
  body: object({
    type: string().required("Type is 'increment or decrement'"),
  }),
});

export const GetListProductForOrder = object({
  body: object({
    list: array()
      .of(string().required("Product ID is required"))
      .required("List products are required"),
  }),
});

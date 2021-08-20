import { object, string } from "yup";

export const CreateCategorySchema = object({
  body: object({
    name: string()
      .required("Name category is required")
      .min(2, "Name category must be included 2 characters"),
  }),
});

export const GetListCategorySortedSchema = object({
  body: object({
    type: string().required("Type is 'increment or decrement'"),
  })
})


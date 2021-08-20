import { object, string } from "yup";

export const CreateUserSchema = object({
  body: object({
    firstName: string()
      .required("First name is requried")
      .min(2, "First name must be included 2 characters"),
    lastName: string()
      .required("Last name is required")
      .min(2, "Last name must be included 2 characters"),
    address: string()
      .required("Address is required")
      .min(5, "Address must be included 5 characters"),
    phone: string()
      .required("Phone is required")
      .matches(/(84|0[3|5|7|8|9])+([0-9]{8,9})\b/, "Phone isn't match"),
    email: string()
      .required("Email is required")
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email isn't match"
      ),
    password: string()
      .required("Password is required")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
        "Password must be included 8 characters with uppercase, lowercase and number"
      ),
    cPassword: string().required("Password confirm is required"),
  }),
});

export const ChangePasswordUserSchema = object({
  body: object({
    password: string().required("Old password is required"),
    newPassword: string()
      .required("New password is required")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
        "New password is not suitable"
      ),
    cNewPassword: string()
      .required("New password confirm í required")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
        "New password confirm is not suitable"
      ),
  }),
});

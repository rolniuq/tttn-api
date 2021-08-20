import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "../../config/Default";
import Common from "../utils/Common";

export interface UserDocument extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  comparePassword(cPassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: Common.role.GUEST,
      enum: Object.values(Common.role),
    }
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next: mongoose.HookNextFunction) {
  let user = this as UserDocument;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(config.saltHashPassword);

  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
});

UserSchema.methods.comparePassword = async function (
  cPassword: string
) {
  const user = this as UserDocument;

  return bcrypt.compare(cPassword, user.password).catch((e) => false);
};

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;

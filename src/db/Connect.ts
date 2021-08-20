import mongoose from "mongoose";
import config from "../../config/Default";

const ConnectDB = () => {
  return mongoose
    .connect(config.dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .then(() => {
      console.log("Connected to database")
    })
    .catch((error) => {
      console.log("Connection has failed: ", error);
      process.exit(1);
    })
}

export default ConnectDB;

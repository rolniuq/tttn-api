import express from "express";
import session from "express-session";
import config from "../config/Default";
import ConnectDB from "./db/Connect";
import InitialRoute from "./routes/index.Route";
import paypal from "paypal-rest-sdk";
import cors from "cors";

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': config.clientID,
  'client_secret': config.secret,
});

const app = express();

const port = config.port;
const host = config.host;

app.use(express.static("public"));
app.use(cors({
  credentials:true,
  origin: ['http://localhost:4000', 'http://localhost:3000'],
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: config.secretKey,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000, domain: "localhost" }
}));

app.listen(port, host, () => {
  console.log("Server is opening at http://%s:%s ", host, port);

  ConnectDB();

  InitialRoute(app);
});
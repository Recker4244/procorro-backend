const auth = require("./routes/auth.js");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");

const adminRouter = require("./routes/adminRouter");
const userRouter = require("./routes/user.js");
const companyRouter = require("./routes/company.js");
const orderRouter = require("./routes/order.js");
// const { verifyJWT } = require('./middlewares/auth');

require("dotenv").config();
const app = express();
const port = 3000;

let corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

if (!process.env.jwtPrivateKey) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use(express.json());
app.use(cookieParser());
app.use("/auth", auth);
//app.use(verifyJWT);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/company", companyRouter);
app.use("/order", orderRouter);

app.listen(port, () =>
  console.log(`Dashboard BE listening at http://localhost:${port}`)
);

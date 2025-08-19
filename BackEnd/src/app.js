import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express()

app.use(cors({
    origin: [process.env.CORS_ORIGIN, "http://localhost:5174","http://localhost:5173"],
    credentials:true
}));

app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({limit:"10mb", extended: true}));
app.use(express.static("public"));
app.use(cookieParser());


import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import orderRouter from "./routes/order.route.js";
import adminOrderRouter from "./routes/adminOrder.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import customizeRouter from "./routes/customize.routes.js";

app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/orders", adminOrderRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/customize", customizeRouter);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error details:", {
    message: error.message,
    stack: error.stack,
    statusCode: error.statusCode,
    name: error.name
  });
  
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors || []
    });
  }
  
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: error.message
  });
});

export default app
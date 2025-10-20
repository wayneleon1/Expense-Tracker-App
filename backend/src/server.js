import dotenv from "dotenv";
import express, { json } from "express";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRouters from "./routes/transactionsRoutes.js";
import job from "./config/cron.js";

import { initDB } from "./config/db.js";

dotenv.config();
const app = express();

if (process.env.NODE_ENV === "production") job.start();

app.use(rateLimiter);
app.use(json());

const PORT = process.env.PORT || 5001;

app.get("/api/health", (res, req) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactionsRouters);

app.get("/", (req, res) => {
  res.send("Expense Tracker API is running");
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on:", PORT);
  });
});

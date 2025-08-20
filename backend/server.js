import express, { json } from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();
const app = express();

// middleware
app.use(json());

const PORT = process.env.PORT || 5001;

const initDB = async () => {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;
    console.log("Database initializing successfully");
  } catch (error) {
    console.log("Error initialing DB", error);
    process.exit(1);
  }
};

app.post("/api/transactions", async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || !category || !user_id || amount === undefined) {
      res.status(400).json({ message: "All fields are required" });
    }
    const transaction = await sql`
    INSERT INTO transactions(user_id,title,amount,category)
    VALUES (${user_id},${title},${amount},${category})
     RETURNING *
    `;

    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on:", PORT);
  });
});

import cookieParser from "cookie-parser";
import express from "express";
import { connectDb } from "./db/user_db.js";
import userRoutes from "./routes/user_routes.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config({
  path: "./.env",
});

const app = express();
connectDb();

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);

//must be included before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes

app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  res.send("it is working");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port} `);
});

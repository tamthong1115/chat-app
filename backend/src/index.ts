import express from "express";
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.route";
import dotenv from "dotenv";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
const PORT = process.env.PORT;

// parse incoming JSON req
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// parse cookies
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/message",messageRoutes)

connectDB();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

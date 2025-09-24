import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/mongodb";
import authRoutes from "./routes/authRoutes";
import transactionRoutes from "./routes/transactionsRoutes";

const app = express();
const allowedOrigins = ["http://localhost:5173"];

connectDB();
const PORT = process.env.PORT || 4000;

app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/transaction", transactionRoutes);

app.get("/", (req, res) => res.send("NetBank backend running"));

app.listen(PORT, () => console.log(`listening on ${PORT}`));

import express from "express";
import { authRequired } from "../middleware/authRequired";
import {
  sendMoney,
  getTransactions,
  getAllTransactions,
} from "../controllers/transactionController";

const router = express.Router();

router.post("/sendmoney", authRequired, sendMoney);

router.get("/all", authRequired, getTransactions);

router.get("/all-users", authRequired, getAllTransactions); 

export default router;

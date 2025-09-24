import { RequestHandler, Response } from "express";
import mongoose from "mongoose";
import userModel from "../models/userModel";
import transactionModel from "../models/transactionModel";
import { userWithSession } from "../common/types";

export const sendMoney = async (req: userWithSession, res: Response) => {
  const sessionUser = req.session;
  const { receiverId, amount } = req.body;

  if (!receiverId || !amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid transfer details" });
  }

  if (!sessionUser?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (String(sessionUser.userId) === String(receiverId)) {
    return res.status(400).json({ error: "Cannot send money to yourself" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sender = await userModel
      .findOne({ userId: sessionUser.userId })
      .session(session);
    const receiver = await userModel
      .findOne({ userId: receiverId })
      .session(session);

    if (!sender || !sender.user) throw new Error("Sender not found");
    if (!receiver || !receiver.user) throw new Error("Receiver not found");

    if (sender.user.amount < amount) {
      throw new Error("Insufficient balance");
    }

    sender.user.amount -= amount;
    receiver.user.amount += amount;

    const transaction = await transactionModel.create(
      [
        {
          transactionId: new mongoose.Types.ObjectId().toString(),
          senderId: sender.userId,
          receiverId: receiver.userId,
          amount,
          transactionType: "transfer",
        },
      ],
      { session }
    );

    sender.user.transactions.push(transaction[0]._id);
    receiver.user.transactions.push(transaction[0]._id);

    await sender.save({ session });
    await receiver.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.json({
      ok: true,
      transaction: transaction[0],
    });
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("sendMoney error:", err);
    return res.status(500).json({ error: err.message || "Transaction failed" });
  }
};

export const getTransactions = async (req: userWithSession, res: Response) => {
  try {
    const sessionUser = req.session;

    if (!sessionUser?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const transactions = await transactionModel
      .find({
        $or: [
          { senderId: sessionUser.userId },
          { receiverId: sessionUser.userId },
        ],
      })
      .sort({ createdAt: -1 });

    return res.json({ ok: true, transactions });
  } catch (err: any) {
    console.error("getTransactions error:", err);
    return res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

export const getAllTransactions: RequestHandler = async (req, res) => {
  try {
    const transactions = await transactionModel
      .find({})
      .sort({ createdAt: -1 });
    return res.json({ ok: true, transactions });
  } catch (err: any) {
    console.error("getAllTransactions error:", err);
    return res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

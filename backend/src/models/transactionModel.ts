import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  senderId: { type: Number, required: true },
  receiverId: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Transaction", transactionSchema);

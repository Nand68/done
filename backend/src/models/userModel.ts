import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  sid: { type: String, required: true, unique: true },
  userId: { type: Number, required: true },
  token: { type: String },
  user: {
    username: String,
    firstName: String,
    lastName: String,
    amount: { type: Number, default: 1000, required: true },
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  },
  createdAt: { type: Date, default: Date.now },

  expiresAt: { type: Date, default: () => Date.now() + 1000 * 60 * 60 },
});

userSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("User", userSchema);

import { Response, NextFunction } from "express";
import userModel from "../models/userModel";
import { authMiddlewareProp, UserModelProp } from "../common/types";

export const authRequired = async (
  req: authMiddlewareProp,
  res: Response,
  next: NextFunction
) => {
  try {
    const sid = req.cookies.sid;
    console.log(sid);
    if (!sid) return res.status(401).json({ error: "Not authenticated" });

    const session = await userModel.findOne({ sid }).lean<UserModelProp>();
    if (!session) return res.status(401).json({ error: "Invalid session" });

    if (session.expiresAt < new Date()) {
      await userModel.deleteOne({ sid });
      return res.status(401).json({ error: "Session expired" });
    }

    req.session = session;
    next();
  } catch (err) {
    console.error("auth middleware error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

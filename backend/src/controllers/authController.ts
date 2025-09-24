import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import userModel from "../models/userModel";
import { authMiddlewareProp, userWithSession } from "../common/types";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username & password required" });
    }

    const response = await axios.post(
      "https://dummyjson.com/auth/login",
      { username, password },
      { headers: { "Content-Type": "application/json" } }
    );

    const data = response.data;
    const sid = uuidv4();

    await userModel.create({
      sid,
      userId: data.id,
      token: data.token,
      user: {
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        amount: 1000,
        transactions: [],
      },
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    res.cookie("sid", sid, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      ok: true,
      user: {
        id: data.id,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Login failed";
    console.error("login error:", message);
    return res.status(401).json({ error: message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const sid = req.cookies.sid;
    if (sid) {
      await userModel.deleteOne({ sid });
    }
    res.clearCookie("sid");
    return res.json({ ok: true });
  } catch (err) {
    console.error("logout error:", err);
    return res.status(500).json({ error: "Logout failed" });
  }
};

export const userData = async (req: userWithSession, res: Response) => {
  const s = req.session;
  if (s) {
    return res.json({ user: s.user });
  } else {
    return res.status(404).json({ error: "user not found" });
  }
};

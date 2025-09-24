import { Request } from "express";
import { Types } from "mongoose";

export interface TransactionRef {
  _id: Types.ObjectId;
}

export interface UserDataProp {
  username: string;
  firstName: string;
  lastName: string;
  amount: number;
  transactions: TransactionRef[];
}

export interface UserModelProp {
  sid: string;
  userId: number;
  token?: string;
  user: UserDataProp;
  createdAt: Date;
  expiresAt: Date;
}

export interface UserProp {
  user: UserModelProp;
}

export interface SidProp {
  sid: string;
}

export interface userWithSession extends Request {
  cookies: { sid?: string };
  session?: UserModelProp;
}

export interface authMiddlewareProp extends Request {
  cookies: { sid?: string };
  session?: UserModelProp;
}

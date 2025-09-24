import express from "express";

import { login, logout, userData } from "../controllers/authController";
import { authRequired } from "../middleware/authRequired";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/userdata", authRequired, userData);

export default router;

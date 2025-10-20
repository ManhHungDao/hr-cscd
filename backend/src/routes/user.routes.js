import { Router } from "express";
import { login, register, profile } from "../controllers/user.controller.js";
import { auth } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/me", auth, profile);

export default router;

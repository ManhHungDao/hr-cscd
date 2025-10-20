import { Router } from "express";
import userRoutes from "./user.routes.js";
import soldierRoutes from "./soldier.routes.js";

const router = Router();
router.use("/api", userRoutes);
router.use("/api/soldiers", soldierRoutes);

export default router;

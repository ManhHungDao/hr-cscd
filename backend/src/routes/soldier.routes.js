import { Router } from "express";
import { list, create, detail, update, remove } from "../controllers/soldier.controller.js";
import { auth } from "../middleware/auth.middleware.js";
const router = Router();

router.get("/", auth, list);
router.post("/", auth, create);
router.get("/:id", auth, detail);
router.put("/:id", auth, update);
router.delete("/:id", auth, remove);

export default router;

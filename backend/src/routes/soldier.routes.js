// import express from "express";
// import * as SoldierController from "../controllers/soldier/SoldierController.js";

// const router = express.Router();

// // CRUD Routes
// router.get("/", SoldierController.getAllSoldiers);
// router.get("/:id", SoldierController.getSoldierById);
// router.post("/", SoldierController.createSoldier);
// router.put("/:id", SoldierController.updateSoldier);
// router.delete("/:id", SoldierController.deleteSoldier);

// export default router;

// src/routes/soldier.routes.js
import { Router } from "express";
import {
  createSoldier,
  getSoldiers,
  getSoldierById,
  updateSoldier,
  deleteSoldier,
} from "../controllers/SoldierController.js";
const router = Router();

// GET /api/soldiers?q=...&page=1&limit=10
router.get("/", getSoldiers);

// GET /api/soldiers/:id
router.get("/:id", getSoldierById);

// POST /api/soldiers
router.post("/", createSoldier);

// PUT /api/soldiers/:id
router.put("/:id", updateSoldier);

// DELETE /api/soldiers/:id
router.delete("/:id", deleteSoldier);

export default router;

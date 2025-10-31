import express from "express";
import * as SoldierController from "../controllers/soldier/SoldierController.js";

const router = express.Router();

// CRUD Routes
router.get("/", SoldierController.getAllSoldiers);
router.get("/:id", SoldierController.getSoldierById);
router.post("/", SoldierController.createSoldier);
router.put("/:id", SoldierController.updateSoldier);
router.delete("/:id", SoldierController.deleteSoldier);

export default router;

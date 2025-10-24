const express = require("express");
const router = express.Router();
const SoldierController = require("../controllers/SoldierController");

// CRUD Routes
router.get("/", SoldierController.getAllSoldiers);
router.get("/:id", SoldierController.getSoldierById);
router.post("/", SoldierController.createSoldier);
router.put("/:id", SoldierController.updateSoldier);
router.delete("/:id", SoldierController.deleteSoldier);

module.exports = router;

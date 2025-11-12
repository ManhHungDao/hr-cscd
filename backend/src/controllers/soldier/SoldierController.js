// src/controllers/soldier.controller.js
import { Soldier } from "../../models/soldier.model.js"; // chỉnh lại path đúng dự án của em
import mongoose from "mongoose";

// chuyển avatar từ base64 sang Buffer để lưu đúng với schema ImageSchema
function normalizeAvatar(avatar) {
  if (!avatar || !avatar.data) return undefined;
  return {
    name: avatar.name || "avatar",
    data: Buffer.from(avatar.data, "base64"),
    contentType: avatar.contentType || "image/png",
  };
}

export const createSoldier = async (req, res) => {
  try {
    const body = req.body || {};

    const avatar = normalizeAvatar(body.avatar);
    if (avatar) body.avatar = avatar;
    else delete body.avatar;

    // mảng người thân nếu không có thì để []
    if (!Array.isArray(body.familyMembers)) {
      body.familyMembers = [];
    }

    const soldier = await Soldier.create(body);
    return res.status(201).json(soldier);
  } catch (err) {
    console.error("createSoldier error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const getSoldiers = async (req, res) => {
  try {
    const {
      q, // tìm theo tên
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};
    if (q) {
      filter.fullName = { $regex: q, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Soldier.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Soldier.countDocuments(filter),
    ]);

    return res.json({
      data: items,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    console.error("getSoldiers error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const getSoldierById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const soldier = await Soldier.findById(id);
    if (!soldier) {
      return res.status(404).json({ message: "Không tìm thấy hồ sơ" });
    }
    return res.json(soldier);
  } catch (err) {
    console.error("getSoldierById error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const updateSoldier = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const body = req.body || {};
    const avatar = normalizeAvatar(body.avatar);
    if (avatar) body.avatar = avatar;
    // nếu front không gửi avatar thì không đè
    else delete body.avatar;

    if (body.familyMembers && !Array.isArray(body.familyMembers)) {
      body.familyMembers = [];
    }

    const soldier = await Soldier.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!soldier) {
      return res.status(404).json({ message: "Không tìm thấy hồ sơ" });
    }
    return res.json(soldier);
  } catch (err) {
    console.error("updateSoldier error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const deleteSoldier = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const soldier = await Soldier.findByIdAndDelete(id);
    if (!soldier) {
      return res.status(404).json({ message: "Không tìm thấy hồ sơ" });
    }
    return res.json({ message: "Đã xóa hồ sơ" });
  } catch (err) {
    console.error("deleteSoldier error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

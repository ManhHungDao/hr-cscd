// src/controllers/soldierController.js
import { Soldier } from "../../models/soldier/soldier.model.js";

// 📍 Lấy tất cả chiến sĩ
export const getAllSoldiers = async (req, res) => {
  try {
    const { q } = req.query; // tìm kiếm theo tên
    const filter = q ? { fullName: new RegExp(q, "i") } : {};
    const soldiers = await Soldier.find(filter).sort({ updatedAt: -1 });
    res.json(soldiers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Không thể tải danh sách chiến sĩ" });
  }
};

// 📍 Lấy 1 chiến sĩ theo ID
export const getSoldierById = async (req, res) => {
  try {
    const soldier = await Soldier.findById(req.params.id);
    if (!soldier)
      return res.status(404).json({ error: "Không tìm thấy chiến sĩ" });
    res.json(soldier);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi tải dữ liệu chiến sĩ" });
  }
};

// 📍 Thêm mới chiến sĩ
export const createSoldier = async (req, res) => {
  try {
    const newSoldier = new Soldier(req.body);
    const saved = await newSoldier.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Không thể tạo mới chiến sĩ" });
  }
};

// 📍 Cập nhật thông tin chiến sĩ
export const updateSoldier = async (req, res) => {
  try {
    const updated = await Soldier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated)
      return res.status(404).json({ error: "Không tìm thấy chiến sĩ" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Không thể cập nhật chiến sĩ" });
  }
};

// 📍 Xóa chiến sĩ
export const deleteSoldier = async (req, res) => {
  try {
    const deleted = await Soldier.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Không tìm thấy chiến sĩ" });
    res.json({ message: "Đã xóa chiến sĩ thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Không thể xóa chiến sĩ" });
  }
};

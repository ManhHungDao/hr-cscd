const Soldier = require("../models/soldier");

/**
 * SoldierController – CRUD cơ bản cho hồ sơ chiến sĩ
 * Bao gồm:
 *   - getAllSoldiers
 *   - getSoldierById
 *   - createSoldier
 *   - updateSoldier
 *   - deleteSoldier
 */

// [GET] /soldiers
exports.getAllSoldiers = async (req, res) => {
  try {
    const { q } = req.query; // tìm theo tên
    const filter = q ? { fullName: new RegExp(q, "i") } : {};
    const soldiers = await Soldier.find(filter).sort({ updatedAt: -1 });
    res.json(soldiers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Không thể tải danh sách chiến sĩ" });
  }
};

// [GET] /soldiers/:id
exports.getSoldierById = async (req, res) => {
  try {
    const soldier = await Soldier.findById(req.params.id);
    if (!soldier)
      return res.status(404).json({ error: "Không tìm thấy hồ sơ chiến sĩ" });
    res.json(soldier);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi tải hồ sơ chiến sĩ" });
  }
};

// [POST] /soldiers
exports.createSoldier = async (req, res) => {
  try {
    const data = req.body;
    if (!data.fullName)
      return res.status(400).json({ error: "Thiếu trường fullName" });

    const soldier = new Soldier(data);
    await soldier.save();
    res.status(201).json({
      message: "Tạo hồ sơ chiến sĩ thành công",
      soldier,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Không thể tạo mới hồ sơ chiến sĩ" });
  }
};

// [PUT] /soldiers/:id
exports.updateSoldier = async (req, res) => {
  try {
    const { id } = req.params;
    const soldier = await Soldier.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!soldier)
      return res
        .status(404)
        .json({ error: "Không tìm thấy hồ sơ để cập nhật" });
    res.json({
      message: "Cập nhật hồ sơ thành công",
      soldier,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Không thể cập nhật hồ sơ chiến sĩ" });
  }
};

// [DELETE] /soldiers/:id
exports.deleteSoldier = async (req, res) => {
  try {
    const soldier = await Soldier.findByIdAndDelete(req.params.id);
    if (!soldier)
      return res.status(404).json({ error: "Không tìm thấy hồ sơ để xóa" });
    res.json({ message: "Đã xóa hồ sơ chiến sĩ", soldier });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Không thể xóa hồ sơ chiến sĩ" });
  }
};

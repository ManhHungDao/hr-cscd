import Soldier from "../models/soldier.model.js";
import { ok, created, fail } from "../utils/response.util.js";

export async function list(req, res, next) {
  try {
    const q = req.query.q;
    const filter = q ? { name: new RegExp(q, "i") } : {};
    const data = await Soldier.find(filter).populate("departmentId", "name code");
    return ok(res, data);
  } catch (e) { next(e); }
}

export async function create(req, res, next) {
  try {
    const soldier = await Soldier.create(req.body);
    return created(res, soldier);
  } catch (e) { next(e); }
}

export async function detail(req, res, next) {
  try {
    const soldier = await Soldier.findById(req.params.id).populate("departmentId", "name code");
    if (!soldier) return fail(res, 404, "Not found");
    return ok(res, soldier);
  } catch (e) { next(e); }
}

export async function update(req, res, next) {
  try {
    const soldier = await Soldier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!soldier) return fail(res, 404, "Not found");
    return ok(res, soldier);
  } catch (e) { next(e); }
}

export async function remove(req, res, next) {
  try {
    await Soldier.findByIdAndDelete(req.params.id);
    return ok(res, { id: req.params.id });
  } catch (e) { next(e); }
}

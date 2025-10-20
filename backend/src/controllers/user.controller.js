import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ok, created, fail } from "../utils/response.util.js";

export async function register(req, res, next) {
  try {
    const { fullName, username, password, role } = req.body;
    const exists = await User.findOne({ username });
    if (exists) return fail(res, 400, "Username already exists");
    const user = await User.create({ fullName, username, password, role });
    return created(res, { id: user._id, username: user.username });
  } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) return fail(res, 401, "Invalid credentials");
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "12h" });
    return ok(res, { token });
  } catch (e) { next(e); }
}

export async function profile(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return ok(res, user);
  } catch (e) { next(e); }
}

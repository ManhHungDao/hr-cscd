import { useCallback, useEffect, useState } from "react";

export function useSoldiers(initialParams = { page: 1, limit: 10, q: "" }) {
  const BASE_URL = "http://localhost:4000/api/soldiers";

  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState(initialParams);

  const [raw, setRaw] = useState(null); // dữ liệu 1 hồ sơ
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** 🧩 Lấy danh sách */
  const fetchList = useCallback(
    async (overrideParams) => {
      setLoading(true);
      setError("");
      console.log("Fetching soldiers with params");
      try {
        const p = overrideParams || params;
        const query = new URLSearchParams(p).toString();
        const res = await fetch(query ? `${BASE_URL}?${query}` : BASE_URL);
        if (!res.ok) throw new Error("Không lấy được danh sách chiến sĩ");
        const data = await res.json();
        setList(data.data || []);
        setTotal(data.total || 0);
        if (overrideParams) setParams(overrideParams);
      } catch (err) {
        console.error(err);
        setError(err.message || "Lỗi tải danh sách");
      } finally {
        setLoading(false);
      }
    },
    [params]
  );

  /** 🧩 Lấy chi tiết 1 hồ sơ */
  const fetchOne = useCallback(async (id) => {
    if (!id) return null;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/${id}`);
      if (!res.ok) throw new Error("Không tìm thấy hồ sơ");
      const data = await res.json();
      setRaw(data);
      return data;
    } catch (err) {
      console.error(err);
      setError(err.message || "Lỗi tải hồ sơ");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** 🧩 Tạo mới chiến sĩ */
  const createSoldier = useCallback(
    async (payload) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const t = await res.json().catch(() => ({}));
          throw new Error(t.message || "Tạo hồ sơ thất bại");
        }
        const created = await res.json();
        await fetchList();
        return created;
      } catch (err) {
        console.error(err);
        setError(err.message || "Lỗi tạo hồ sơ");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchList]
  );

  /** 🧩 Cập nhật */
  const updateSoldier = useCallback(
    async (id, payload) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${BASE_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const t = await res.json().catch(() => ({}));
          throw new Error(t.message || "Cập nhật thất bại");
        }
        const updated = await res.json();
        await fetchList();
        return updated;
      } catch (err) {
        console.error(err);
        setError(err.message || "Lỗi cập nhật hồ sơ");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchList]
  );

  /** 🧩 Xoá hồ sơ */
  const deleteSoldier = useCallback(
    async (id) => {
      if (!window.confirm("Xác nhận xoá hồ sơ này?")) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const t = await res.json().catch(() => ({}));
          throw new Error(t.message || "Xoá thất bại");
        }
        await res.json();
        await fetchList();
      } catch (err) {
        console.error(err);
        setError(err.message || "Lỗi xoá hồ sơ");
      } finally {
        setLoading(false);
      }
    },
    [fetchList]
  );

  // load danh sách ban đầu
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return {
    list,
    total,
    params,
    setParams,
    raw,
    loading,
    error,
    fetchList,
    fetchOne,
    createSoldier,
    updateSoldier,
    deleteSoldier,
  };
}

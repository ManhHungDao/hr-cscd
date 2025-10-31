import { useEffect, useMemo, useState } from "react";
import { fmtDate, joinAddress, nonEmpty } from "@/utils/format";
export function useFetchSoldier({
  id,
  apiBase = "http://localhost:4000/api/soldiers",
}) {
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`${apiBase}/${id}`, {
          // SỬA 3: Dùng 'Accept' thay vì 'Content-Type' cho request GET
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const data = await res.json();
        if (alive) setRaw(data);
      } catch (e) {
        if (alive) setErr(e?.message || "Lỗi tải dữ liệu");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, apiBase]);

  const profile = useMemo(() => {
    if (!raw) return null;

    // SỬA 4: Dùng 'raw' trực tiếp thay vì tạo biến 'd' không cần thiết
    return {
      avatar: raw.avatar,
      name: (raw.fullName || "").toUpperCase(),
      rank: raw.current?.rank || "",
      position: raw.current?.position || "",
      code: raw.identityDocs?.policeCode || "",
      unitLine: raw.unitPath || "",
      basic: nonEmpty({
        "Ngày Sinh": fmtDate(raw.demographics?.birthDate),
        "Nơi Sinh": raw.demographics?.birthPlace,
        "Quê Quán": raw.demographics?.hometown,
        "Dân Tộc": raw.demographics?.ethnicity,
        "Địa Chỉ Thường Trú": raw.demographics?.permanentAddress,
        "Địa Chỉ Hiện Tại": joinAddress(raw.demographics?.currentAddress),
        "Tôn Giáo": raw.demographics?.religion,
        "Nhóm Máu": raw.demographics?.bloodType,
        "Tình Trạng Hôn Nhân": raw.demographics?.maritalStatus,
        "Số Điện Thoại": raw.demographics?.phone,
        "Hộp Thư": raw.demographics?.email,
      }),
      family: nonEmpty(raw.family || {}),
      // ...
    };
  }, [raw]);

  return { raw, profile, loading, err };
}

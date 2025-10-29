import { useEffect, useMemo, useState } from "react";
import { fmtDate, joinAddress, nonEmpty } from "@/utils/format";

export default function useSoldier({
  id,
  apiBase = "http://localhost:4000/api/soldiers",
}) {
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`${apiBase}/${id}`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
    const d = raw || {};
    const phones = (d?.contact?.phones || [])
      .map((p) => `${p.label}: ${p.number}`)
      .join(" • ");
    const emails = (d?.contact?.emails || [])
      .map((e) => `${e.label}: ${e.address}`)
      .join(" • ");

    return {
      avatar: d.avatar || "https://i.pravatar.cc/120?img=35",
      name: (d.fullName || "").toUpperCase(),
      rank: d.current?.rank || "",
      position: d.current?.position || "",
      code: d.identityDocs?.policeCode || "",
      unitLine: d.unitPath || "",
      basic: nonEmpty({
        "Ngày Sinh": fmtDate(d.demographics?.birthDate),
        "Nơi Sinh": d.demographics?.birthPlace,
        "Quê Quán": d.demographics?.hometown,
        "Dân Tộc": d.demographics?.ethnicity,
        "Địa Chỉ Thường Trú": d.demographics?.permanentAddress,
        "Địa Chỉ Hiện Tại": joinAddress(d.demographics?.currentAddress),
        "Tôn Giáo": d.demographics?.religion,
        "Nhóm Máu": d.demographics?.bloodType,
        "Tình Trạng Hôn Nhân": d.demographics?.maritalStatus,
        "Số Điện Thoại": phones,
        "Hộp Thư": emails,
      }),
      family: nonEmpty(d.family || {}),
      party: nonEmpty({ NgàyVàoCAND: fmtDate(d.party?.joinedPoliceAt) }),
      trainings: d.trainings || [],
      serviceHistory: d.serviceHistory || [],
      awards: d.awards || [],
      disciplines: d.disciplines || [],
      documents: d.documents || [],
      attendance: d.attendance || null,
    };
  }, [raw]);

  return { raw, profile, loading, err };
}

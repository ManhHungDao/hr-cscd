import { useEffect, useMemo, useState } from "react";
import { fmtDate, joinAddress, nonEmpty } from "@/utils/format";

export default function useSoldier({ id, apiBase = "http://localhost:4000/api/soldiers" }) {
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`${apiBase}/${id}`, { headers: { "Content-Type": "application/json" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (alive) setRaw(data);
      } catch (e) {
        if (alive) setErr(e?.message || "Lỗi tải dữ liệu");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id, apiBase]);

  const profile = useMemo(() => {
    const d = raw || {};
    const phones = (d?.contact?.phones || []).map((p) => `${p.label}: ${p.number}`).join(" • ");
    const emails = (d?.contact?.emails || []).map((e) => `${e.label}: ${e.address}`).join(" • ");

    return {
      avatar: d.avatar || "https://i.pravatar.cc/120?img=35",
      name: (d.fullName || "").toUpperCase(),
      rank: d.current?.rank || "",
      position: d.current?.position || "",
      code: d.identityDocs?.policeCode || "",
      unitLine: d.unitPath || "",
      basic: nonEmpty({
        NgàySinh: fmtDate(d.demographics?.birthDate),
        NơiSinh: d.demographics?.birthPlace,
        QuêQuán: d.demographics?.hometown,
        ĐịaChỉThườngTrú: d.demographics?.permanentAddress,
        ĐịaChỉHiệnTại: joinAddress(d.demographics?.currentAddress),
        NhómMáu: d.demographics?.bloodType,
        TìnhTrạngHônNhân: d.demographics?.maritalStatus,
        DânTộc: d.demographics?.ethnicity,
        TônGiáo: d.demographics?.religion,
        SốCon: d.demographics?.childrenCount,
      }),
      contact: nonEmpty({ SốĐiệnThoại: phones, HộpThư: emails }),
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

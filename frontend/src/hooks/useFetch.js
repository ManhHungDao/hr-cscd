import { useEffect, useState, useRef } from "react";

export default function useFetch(url, opts) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);
  const nonceRef = useRef(0); // để refetch nếu cần sau này

  useEffect(() => {
    if (!url) return;

    let alive = true;
    const controller = new AbortController();
    const signal = controller.signal;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url, { ...opts, signal });
        const contentType = res.headers.get("content-type") || "";
        const raw = await res.text(); // đọc text trước để tự parse

        if (!res.ok) {
          // backend trả lỗi có thể là text/json — cứ log 200 ký tự đầu
          throw new Error(
            `HTTP ${res.status} ${res.statusText} — ${raw.slice(0, 200)}`
          );
        }

        // Nếu là JSON (chuẩn) → parse
        if (contentType.includes("application/json")) {
          try {
            const json = JSON.parse(raw);
            if (alive) setData(json);
          } catch (e) {
            // Tránh lỗi Unexpected token '<' do server trả HTML
            throw new Error(
              `Phản hồi JSON không hợp lệ. Có thể đang nhận HTML (snippet: ${raw.slice(
                0,
                80
              )})`
            );
          }
        } else {
          // Không phải JSON → ném lỗi kèm gợi ý proxy/base URL
          throw new Error(
            `Nhận phản hồi không phải JSON (content-type: ${contentType}). Snippet: ${raw.slice(
              0,
              120
            )}`
          );
        }
      } catch (e) {
        if (alive && e.name !== "AbortError") setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();

    return () => {
      alive = false;
      controller.abort();
    };
    // Nếu muốn bắt thay đổi opts, dùng JSON.stringify(opts)
  }, [url /* , JSON.stringify(opts) */]);

  return { data, loading, error, setData };
}

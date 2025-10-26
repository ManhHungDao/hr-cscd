import { useEffect, useState } from "react";

export default function useFetch(url, opts) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    async function run() {
      if (!url) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, opts);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (alive) setData(json);
      } catch (e) {
        if (alive) setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => {
      alive = false;
    };
  }, [url]);

  return { data, loading, error, setData };
}

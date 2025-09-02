'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [faq, setFaq] = useState<any[]>([]);
  const [apiStatus, setApiStatus] = useState<"ok"|"fail"|"loading">("loading");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function testApi() {
      setApiStatus("loading");
      try {
        const r = await fetch('/api/tools/faq', { headers: { 'x-api-key': process.env.NEXT_PUBLIC_TOOLS_API_KEY || '' } });
        const j = await r.json();
        if (j.items) {
          setFaq(j.items);
          setApiStatus("ok");
        } else {
          setApiStatus("fail");
          setError(j.error || "Unknown error");
        }
      } catch (e: any) {
        setApiStatus("fail");
        setError(e?.message || "Unknown error");
      }
    }
    testApi();
  }, []);

  return (
    <div className="card">
      <div className="h2">Dashboard</div>
      <p className="small">Základní zobrazení + test API připojení.</p>
      <div>
        <b>API Status:</b> {apiStatus === "loading" ? "..." : apiStatus === "ok" ? "Connected ✅" : "❌ ERROR"}<br/>
        {error && <span style={{ color: "red" }}>{error}</span>}
      </div>
      <div style={{ marginTop: '1em' }}>
        <b>FAQ (demo data z API):</b>
        <ul>
          {faq.map(i => <li key={i.title}><b>{i.title}:</b> {i.answer}</li>)}
        </ul>
      </div>
    </div>
  );
}

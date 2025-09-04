'use client';
import { useEffect, useState } from 'react';

export default function Calls() {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const r = await fetch('/api/tools/calls', {
          headers: { 'x-api-key': process.env.NEXT_PUBLIC_TOOLS_API_KEY || '' }
        });
        const j = await r.json();
        if (j.error) setError(j.error);
        else setCalls(j.calls || []);
      } catch (e: any) {
        setError(e?.message || "Chyba při načítání");
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="card">
      <div className="h2">Hovory</div>
      {loading ? <div>Načítám...</div> : error ? <div style={{color:"red"}}>{error}</div> : (
        <table className="table">
          <thead>
            <tr>
              <th>Jméno</th>
              <th>Čas hovoru</th>
              <th>Rezervace</th>
              <th>Transcript</th>
              <th>AI shrnutí</th>
            </tr>
          </thead>
          <tbody>
            {calls.map(call => (
              <tr key={call.id}>
                <td>{call.name}</td>
                <td>{call.call_time ? new Date(call.call_time).toLocaleString() : ""}</td>
                <td>{call.reservation_time ? new Date(call.reservation_time).toLocaleString() : "-"}</td>
                <td>{call.transcript ? <details><summary>Ukázat</summary><pre>{call.transcript}</pre></details> : "-"}</td>
                <td>{call.summary ? <details><summary>Ukázat</summary><pre>{call.summary}</pre></details> : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

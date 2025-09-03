'use client';
import { useEffect, useState } from 'react';

export default function Settings() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  // Načíst nastavení z API
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const r = await fetch('/api/tools/settings', {
          headers: { 'x-api-key': process.env.NEXT_PUBLIC_TOOLS_API_KEY || '' }
        });
        const j = await r.json();
        if (j.error) setError(j.error);
        else setData(j);
      } catch (e: any) {
        setError(e?.message || "Chyba při načítání");
      }
      setLoading(false);
    }
    load();
  }, []);

  // Uložit změny do API
  async function save() {
    setSaving(true);
    setError("");
    try {
      const r = await fetch('/api/tools/settings', {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_TOOLS_API_KEY || ''
        },
        body: JSON.stringify(data)
      });
      const j = await r.json();
      if (!j.ok) setError(j.error || "Chyba při ukládání");
    } catch (e: any) {
      setError(e?.message || "Chyba při ukládání");
    }
    setSaving(false);
  }

  // Pomocné funkce pro změny v objektu
  function setBusinessHour(day: string, field: string, value: string | boolean) {
    setData((d: any) => ({
      ...d,
      business_hours: {
        ...d.business_hours,
        [day]: {
          ...d.business_hours[day],
          [field]: value
        }
      }
    }));
  }

  function setProcedure(name: string, value: number) {
    setData((d: any) => ({
      ...d,
      procedures: {
        ...d.procedures,
        [name]: value
      }
    }));
  }

  function setVacation(idx: number, field: string, value: string) {
    setData((d: any) => ({
      ...d,
      vacations: d.vacations.map((v: any, i: number) => i === idx ? { ...v, [field]: value } : v)
    }));
  }

  function addVacation() {
    setData((d: any) => ({
      ...d,
      vacations: [...d.vacations, { start: "", end: "" }]
    }));
  }

  function removeVacation(idx: number) {
    setData((d: any) => ({
      ...d,
      vacations: d.vacations.filter((_: any, i: number) => i !== idx)
    }));
  }

  if (loading) return <div className="card">Načítám nastavení...</div>;
  if (error) return <div className="card"><span style={{color:'red'}}>{error}</span></div>;
  if (!data) return <div className="card">Chyba: žádná data</div>;

  return (
    <div className="card">
      <div className="h2">Nastavení ordinace</div>

      <div style={{marginBottom:24}}>
        <b>Ordinační hodiny:</b>
        {Object.keys(data.business_hours).map(day =>
          <div key={day} style={{marginBottom:8}}>
            <span style={{width:90,display:"inline-block"}}>{day.charAt(0).toUpperCase()+day.slice(1)}:</span>
            {data.business_hours[day].closed
              ? <label>
                  <input type="checkbox" checked={true}
                    onChange={e => setBusinessHour(day, "closed", e.target.checked)} />
                  Zavřeno
                </label>
              : <>
                  <input type="time" value={data.business_hours[day].open}
                    onChange={e => setBusinessHour(day, "open", e.target.value)} />
                  -
                  <input type="time" value={data.business_hours[day].close}
                    onChange={e => setBusinessHour(day, "close", e.target.value)} />
                  <label style={{marginLeft:12}}>
                    <input type="checkbox" checked={false}
                      onChange={e => setBusinessHour(day, "closed", e.target.checked)} />
                    Zavřeno
                  </label>
                </>
            }
          </div>
        )}
      </div>

      <div style={{marginBottom:24}}>
        <b>Výkony/procedury (délka v minutách):</b>
        {Object.keys(data.procedures).map(name =>
          <div key={name}>
            <span style={{width:120,display:"inline-block"}}>{name}:</span>
            <input type="number" min={1} max={240} value={data.procedures[name]}
              onChange={e => setProcedure(name, Number(e.target.value))} style={{width:70}} /> min
          </div>
        )}
      </div>

      <div style={{marginBottom:24}}>
        <b>Dovolené:</b>
        {data.vacations.map((v: any, idx: number) =>
          <div key={idx}>
            <span>Od:</span>
            <input type="date" value={v.start}
              onChange={e => setVacation(idx, "start", e.target.value)} />
            <span>Do:</span>
            <input type="date" value={v.end}
              onChange={e => setVacation(idx, "end", e.target.value)} />
            <button className="btn" style={{marginLeft:8}} onClick={() => removeVacation(idx)}>Smazat</button>
          </div>
        )}
        <button className="btn" style={{marginTop:8}} onClick={addVacation}>Přidat dovolenou</button>
      </div>

      <div style={{marginBottom:24}}>
        <b>Google Calendar ID:</b>
        <input className="input" value={data.google_calendar_id}
          onChange={e=>setData((d:any)=>({...d,google_calendar_id:e.target.value}))} style={{width:200}} />
      </div>

      <button className="btn" onClick={save} disabled={saving}>{saving ? "Ukládám..." : "Uložit změny"}</button>
    </div>
  );
}

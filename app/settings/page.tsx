'use client';
import { useEffect, useState } from 'react';

export default function Settings() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

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
      vacations: [...(d.vacations || []), { start: "", end: "" }]
    }));
  }

  function removeVacation(idx: number) {
    setData((d: any) => ({
      ...d,
      vacations: (d.vacations || []).filter((_: any, i: number) => i !== idx)
    }));
  }

  // --- Custom parameters ---
  function setCustomParam(key: string, value: string) {
    setData((d: any) => ({
      ...d,
      custom_parameters: {
        ...d.custom_parameters,
        [key]: value
      }
    }));
  }
  function changeCustomParamKey(oldKey: string, newKey: string) {
    setData((d: any) => {
      const cp = { ...d.custom_parameters };
      if (newKey && newKey !== oldKey) {
        cp[newKey] = cp[oldKey];
        delete cp[oldKey];
      }
      return { ...d, custom_parameters: cp };
    });
  }
  function addCustomParam() {
    setData((d: any) => ({
      ...d,
      custom_parameters: {
        ...d.custom_parameters,
        [""]: ""
      }
    }));
  }
  function removeCustomParam(key: string) {
    setData((d: any) => {
      const cp = { ...d.custom_parameters };
      delete cp[key];
      return { ...d, custom_parameters: cp };
    });
  }

  if (loading) return <div className="card">Načítám nastavení...</div>;
  if (error) return <div className="card"><span style={{color:'red'}}>{error}</span></div>;
  if (!data) return <div className="card">Chyba: žádná data</div>;

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

  return (
    <div className="card">
      <div className="h2">Nastavení ordinace</div>
      
      {/* Ordinační hodiny */}
      <div style={{marginBottom:24}}>
        <b>Ordinační hodiny:</b>
        {days.map(day => (
          <div key={day} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <span style={{width:80}}>{day}:</span>
            <input
              className="input"
              style={{width:65}}
              type="text"
              value={data.business_hours?.[day]?.open ?? ""}
              onChange={e => setBusinessHour(day, "open", e.target.value)}
              disabled={data.business_hours?.[day]?.closed}
              placeholder="--:--"
            />
            <span>-</span>
            <input
              className="input"
              style={{width:65}}
              type="text"
              value={data.business_hours?.[day]?.close ?? ""}
              onChange={e => setBusinessHour(day, "close", e.target.value)}
              disabled={data.business_hours?.[day]?.closed}
              placeholder="--:--"
            />
            <label style={{marginLeft:10}}>
              <input
                type="checkbox"
                checked={!!data.business_hours?.[day]?.closed}
                onChange={e => setBusinessHour(day, "closed", e.target.checked)}
              />
              Zavřeno
            </label>
          </div>
        ))}
      </div>
      
      {/* Výkony/procedury */}
      <div style={{marginBottom:24}}>
        <b>Výkony/procedury (délka v minutách):</b>
        {data.procedures &&
          Object.entries(data.procedures).map(([k, v]) => (
            <div key={k} style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{width:120}}>{k}:</span>
              <input
                className="input"
                style={{width:60}}
                type="number"
                value={String(v)}
                onChange={e => setProcedure(k, Number(e.target.value))}
              />
              <span>min</span>
            </div>
          ))}
      </div>

      {/* Dovolené */}
      <div style={{marginBottom:24}}>
        <b>Dovolené:</b>
        {(data.vacations || []).map((v: any, i: number) => (
          <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
            <span>Od:</span>
            <input
              className="input"
              type="date"
              value={v.start}
              onChange={e => setVacation(i, "start", e.target.value)}
              style={{width:140}}
            />
            <span>Do:</span>
            <input
              className="input"
              type="date"
              value={v.end}
              onChange={e => setVacation(i, "end", e.target.value)}
              style={{width:140}}
            />
            <button className="btn" onClick={() => removeVacation(i)}>Smazat</button>
          </div>
        ))}
        <button className="btn" style={{marginTop:8}} onClick={addVacation}>Přidat dovolenou</button>
      </div>

      {/* Google Calendar ID */}
      <div style={{marginBottom:24}}>
        <b>Google Calendar ID:</b>{" "}
        <input
          className="input"
          style={{width:200}}
          value={data.google_calendar_id ?? ""}
          onChange={e => setData((d: any) => ({ ...d, google_calendar_id: e.target.value }))}
        />
      </div>

      {/* Custom parametry */}
      <div style={{marginBottom:24}}>
        <b>Custom parametry:</b>
        {data.custom_parameters &&
          Object.entries(data.custom_parameters).map(([key, value], idx) => (
            <div key={key+idx} style={{display:'flex',alignItems:'center',gap:8}}>
              <input
                className="input"
                style={{width:120}}
                value={key}
                onChange={e => changeCustomParamKey(key, e.target.value)}
                placeholder="Klíč"
              />
              <input
                className="input"
                style={{width:300}}
                value={String(value ?? "")}
                onChange={e => setCustomParam(key, e.target.value)}
                placeholder="Hodnota"
              />
              <button className="btn" onClick={() => removeCustomParam(key)}>Smazat</button>
            </div>
          ))}
        <button className="btn" style={{marginTop:8}} onClick={addCustomParam}>Přidat vlastní parametr</button>
      </div>

      {/* Error a Uložit */}
      {error && <div style={{color:"red",marginBottom:12}}>{error}</div>}
      <button className="btn" onClick={save} disabled={saving}>{saving ? "Ukládám..." : "Uložit změny"}</button>
    </div>
  );
}

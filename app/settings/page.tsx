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
      vacations: [...d.vacations, { start: "", end: "" }]
    }));
  }

  function removeVacation(idx: number) {
    setData((d: any) => ({
      ...d,
      vacations: d.vacations.filter((_: any, i: number) => i !== idx)
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
    const cp = { ...data.custom_parameters };
    delete cp[key];
    setData((d: any) => ({
      ...d,
      custom_parameters: cp
    }));
  }

  if (loading) return <div className="card">Načítám nastavení...</div>;
  if (error) return <div className="card"><span style={{color:'red'}}>{error}</span></div>;
  if (!data) return <div className="card">Chyba: žádná data</div>;

  return (
    <div className="card">
      <div className="h2">Nastavení ordinace</div>
      {/* ... ostatní sekce ... */}

      <div style={{marginBottom:24}}>
        <b>Custom parametry:</b>
        {data.custom_parameters &&
          Object.entries(data.custom_parameters).map(([key, value]) => (
            <div key={key} style={{display:'flex',alignItems:'center',gap:8}}>
              <input
                className="input"
                style={{width:120}}
                value={key}
                onChange={e => {
                  const newKey = e.target.value;
                  setData((d: any) => {
                    const cp = { ...d.custom_parameters };
                    cp[newKey] = cp[key];
                    delete cp[key];
                    return { ...d, custom_parameters: cp };
                  });
                }}
                placeholder="Klíč"
              />
              <input
                className="input"
                style={{width:300}}
                value={value}
                onChange={e => setCustomParam(key, e.target.value)}
                placeholder="Hodnota"
              />
              <button className="btn" onClick={() => removeCustomParam(key)}>Smazat</button>
            </div>
          ))}
        <button className="btn" style={{marginTop:8}} onClick={addCustomParam}>Přidat vlastní parametr</button>
      </div>

      {/* ... ostatní sekce ... */}
      <button className="btn" onClick={save} disabled={saving}>{saving ? "Ukládám..." : "Uložit změny"}</button>
    </div>
  );
}

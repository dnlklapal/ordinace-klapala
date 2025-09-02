'use client';
import { useState } from 'react';
export default function Patients(){
  const [q,setQ]=useState('');const [rows,setRows]=useState<any[]>([]);
  async function search(){const r=await fetch('/api/public/patients.search',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({q})});const j=await r.json();setRows(j.patients||[]);}
  return <div className="card"><div className="h2">Pacienti</div><input className="input" value={q} onChange={e=>setQ(e.target.value)} /><button className="btn" onClick={search}>Hledat</button><table className="table"><tbody>{rows.map(p=><tr key={p.id}><td>{p.name}</td><td>{p.phone}</td></tr>)}</tbody></table></div>;
}

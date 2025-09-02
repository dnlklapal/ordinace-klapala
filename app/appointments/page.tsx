'use client';
import { useState } from 'react';
export default function Appointments(){
  const [name,setName]=useState('');const [dt,setDt]=useState('');
  async function book(){
    const r=await fetch('/api/public/appointments.book',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name,datetime:dt,type:'preventivka'})});
    const j=await r.json();alert(JSON.stringify(j));
  }
  return <div className="card"><div className="h2">Nová objednávka</div><input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Jméno"/><input className="input" value={dt} onChange={e=>setDt(e.target.value)} placeholder="Datum/čas"/><button className="btn" onClick={book}>Potvrdit</button></div>;
}

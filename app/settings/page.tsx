'use client';
import { useState } from 'react';
export default function Settings(){
  const [accept,setAccept]=useState(true);const [parking,setParking]=useState('Parkování u pošty');
  return <div className="card"><div className="h2">Nastavení</div><label><input type='checkbox' checked={accept} onChange={e=>setAccept(e.target.checked)}/> Přijímáme nové pacienty</label><textarea className="input" value={parking} onChange={e=>setParking(e.target.value)} /></div>;
}

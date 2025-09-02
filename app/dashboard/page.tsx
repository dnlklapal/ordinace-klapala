// app/dashboard/page.tsx — verze bez SWR
async function getFaq() {
  const r = await fetch('/api/public/faq', { cache: 'no-store' });
  if (!r.ok) return { items: [] as any[] };
  return r.json();
}

export default async function Dashboard() {
  const faq = await getFaq();

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
      <div className="card">
        <div className="h2">Dnešní hovory</div>
        <table className="table">
          <tbody>
            <tr><td>08:42</td><td>+420 777 000 111</td><td>Objednáno</td></tr>
            <tr><td>09:15</td><td>+420 605 222 333</td><td>Dotaz na ceny</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="h2">FAQ (náhled)</div>
        {!faq?.items?.length ? <div className="small">Žádné položky…</div> : (
          <ul>
            {faq.items.map((it: any) => (
              <li key={it.title} style={{marginBottom:8}}>
                <b>{it.title}:</b> <span className="small">{it.answer}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

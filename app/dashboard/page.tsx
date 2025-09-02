'use client';
import useSWR from 'swr';
const fetcher = (url:string)=>fetch(url).then(r=>r.json());

export default function Dashboard(){
  const { data } = useSWR('/api/public/faq', fetcher);
  return (
    <div>
      <div className="card">
        <div className="h2">Dnešní hovory</div>
        <table className="table"><tbody><tr><td>08:42</td><td>+420777000111</td><td>Objednáno</td></tr></tbody></table>
      </div>
      <div className="card">
        <div className="h2">FAQ (náhled)</div>
        {!data ? <div>Načítám…</div> : <ul>{data.items?.map((it:any)=><li key={it.title}>{it.title}: {it.answer}</li>)}</ul>}
      </div>
    </div>
  );
}

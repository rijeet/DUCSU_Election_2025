'use client';
import { useEffect, useState } from 'react';
import Filters from './Filters';

export default function CandidateList({ positionKey, onDone }: {
  positionKey: string; 
  onDone?: () => void;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  async function load(filters: any = {}) {
    const params = new URLSearchParams({ 
      position: positionKey, 
      ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) 
    });
    const res = await fetch(`/api/candidates?${params.toString()}`);
    const data = await res.json();
    setItems(data.items);
  }
  
  useEffect(() => { load(); }, [positionKey]);

  async function save() {
    const res = await fetch('/api/panel', { 
      method: 'POST', 
      headers: { 'content-type': 'application/json' }, 
      body: JSON.stringify({ positionKey, candidateIds: selected }) 
    });
    if (res.ok) onDone?.();
  }

  return (
    <div className="space-y-3">
      <Filters onChange={load} />
      <ul className="divide-y">
        {items.map(c => (
          <li key={c._id} className="py-3 flex items-center gap-3">
            <img 
              src={c.imgUrl || '/placeholder.png'} 
              className="w-12 h-12 rounded object-cover border" 
              alt={c.name} 
            />
            <div className="flex-1">
              <div className="font-medium">
                {c.name} <span className="opacity-60">#{c.ballotNumber}</span>
              </div>
              <div className="text-sm opacity-70">
                {c.panelId || '—'} · {c.department || '—'} · {c.hall || '—'}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input 
                type="checkbox" 
                checked={selected.includes(c._id)} 
                onChange={(e) => {
                  const next = e.target.checked ? [...selected, c._id] : selected.filter(id => id !== c._id);
                  // enforce max: 1 unless member
                  setSelected(positionKey === 'member' ? next : (e.target.checked ? [c._id] : []));
                }} 
              />
              Select
            </label>
          </li>
        ))}
      </ul>
      <div className="flex justify-end gap-2">
        <button className="border rounded px-3 py-2" onClick={save}>
          Save Selection
        </button>
      </div>
    </div>
  );
}

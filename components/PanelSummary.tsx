'use client';
import { useEffect, useState } from 'react';
import { POSITION_LABELS } from '@/lib/positions';

export default function PanelSummary() {
  const [panel, setPanel] = useState<any>(null);
  
  async function load() { 
    const res = await fetch('/api/panel', { cache: 'no-store' }); 
    setPanel(await res.json()); 
  }
  
  useEffect(() => { load(); }, []);
  
  if (!panel) return null;
  
  return (
    <section className="bg-white rounded-2xl border shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Your Panel</h3>
      <div className="grid md:grid-cols-2 gap-3">
        {Object.entries(panel.selections || {}).map(([pos, ids]: any) => (
          <div key={pos}>
            <div className="text-sm font-medium">{POSITION_LABELS[pos] ?? pos}</div>
            <div className="text-sm opacity-70">{ids.length} selected</div>
          </div>
        ))}
      </div>
    </section>
  );
}

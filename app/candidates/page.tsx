'use client';
import { useEffect, useState } from 'react';
import Filters from '@/components/Filters';
import { POSITION_LABELS } from '@/lib/positions';

interface Candidate {
  _id: string;
  name: string;
  ballotNumber: number;
  imgUrl?: string;
  hall?: string;
  department?: string;
  panelId?: string;
  votesCount?: number;
  positionKey: string;
}

export default function CandidatesPage() {
  const [items, setItems] = useState<Candidate[]>([]);
  
  async function load(filters: any = {}) {
    const params = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) as Record<string, string>);
    const res = await fetch(`/api/candidates?${params.toString()}`);
    const data = await res.json();
    setItems(data.items);
  }
  
  useEffect(() => { load(); }, []);

  return (
    <main className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Candidates</h1>
        <a className="underline" href="/"><img src="/home.png" alt="Home" className="h-8 w-8" /></a>
      </div>
      <Filters onChange={load} />
      <div className="grid md:grid-cols-3 gap-3">
        {items.map(c => (
          <div
            key={c._id}
            className="bg-slate-50 rounded-xl p-4 border-2 border-slate-800 hover:shadow-md transition-shadow hover:bg-[#ebf1e4]"
          >
            <div className="flex flex-col items-center text-center">
              {/* Candidate Image */}
              <div className="w-20 h-20 mb-3 rounded-full overflow-hidden border-2 border-slate-300">
                <img
                  src={c.imgUrl || '/placeholder.png'}
                  alt={c.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.png';
                  }}
                />
              </div>

              {/* Candidate Info */}
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-900 text-sm leading-tight">
                  {c.name} <span className="text-slate-500">({POSITION_LABELS[c.positionKey] || c.positionKey})</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Ballot #{c.ballotNumber}
                </p>
                {c.votesCount !== undefined && (
                  <p className="text-xs text-red-600 font-bold">
                    Votes: {c.votesCount}
                  </p>
                )}
                {c.department && (
                  <p className="text-xs text-slate-500">
                    {c.department}
                  </p>
                )}
                {c.hall && (
                  <p className="text-xs text-slate-500">
                    {c.hall}
                  </p>
                )}
                {c.panelId && (
                  <p className="text-xs text-blue-600 font-medium">
                    {c.panelId}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

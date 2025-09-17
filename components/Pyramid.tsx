'use client';
import { useEffect, useMemo, useState } from "react";
import PositionSquare from "./PositionSquare";
import { PYRAMID_LAYERS } from "@/lib/positions";
import Modal from "./Modal";
import CandidateList from "./CandidateList";

export default function Pyramid() {
  const [open, setOpen] = useState<null | { positionKey: string }>(null);
  const [panel, setPanel] = useState<{ selections: Record<string, string[]> }>({ selections: {} });

  async function fetchPanel() {
    const res = await fetch('/api/panel', { cache: 'no-store' });
    const data = await res.json();
    setPanel({ selections: data?.selections ?? {} });
  }
  
  useEffect(() => { fetchPanel(); }, []);

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const [k, ids] of Object.entries(panel.selections || {})) {
      result[k] = (ids as string[]).length;
    }
    return result;
  }, [panel]);

  return (
    <div className="space-y-3">
      {PYRAMID_LAYERS.map((row, i) => (
        <div key={i} className="flex gap-3 justify-center">
          {row.map((pos, j) => (
            <PositionSquare
              key={pos + "-" + j}
              positionKey={pos}
              selectedCount={counts[pos] ?? 0}
              max={pos === 'member' ? 13 : 1}
              onClick={() => setOpen({ positionKey: pos })}
            />
          ))}
        </div>
      ))}

      <Modal open={!!open} onClose={() => setOpen(null)} title="Select Candidate">
        {open && (
          <CandidateList 
            positionKey={open.positionKey} 
            onDone={() => { 
              setOpen(null); 
              fetchPanel(); 
            }} 
          />
        )}
      </Modal>
    </div>
  );
}

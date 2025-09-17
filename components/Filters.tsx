'use client';
import { useState } from 'react';

export default function Filters({ onChange }: { onChange: (f: any) => void }) {
  const [q, setQ] = useState('');
  const [panelId, setPanelId] = useState('');
  const [ballotNumber, setBallotNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [hall, setHall] = useState('');

  return (
    <div className="grid md:grid-cols-5 gap-2">
      <input 
        value={q} 
        onChange={e => setQ(e.target.value)} 
        placeholder="Search name" 
        className="border rounded px-2 py-2" 
      />
      <input 
        value={ballotNumber} 
        onChange={e => setBallotNumber(e.target.value)} 
        placeholder="Ballot #" 
        className="border rounded px-2 py-2" 
      />
      <input 
        value={panelId} 
        onChange={e => setPanelId(e.target.value)} 
        placeholder="Panel ID" 
        className="border rounded px-2 py-2" 
      />
      <input 
        value={department} 
        onChange={e => setDepartment(e.target.value)} 
        placeholder="Department" 
        className="border rounded px-2 py-2" 
      />
      <input 
        value={hall} 
        onChange={e => setHall(e.target.value)} 
        placeholder="Hall" 
        className="border rounded px-2 py-2" 
      />
      <div className="md:col-span-5 flex gap-2 justify-end">
        <button 
          className="border rounded px-3 py-2" 
          onClick={() => onChange({ q, ballotNumber, panelId, department, hall })}
        >
          Apply
        </button>
        <button 
          className="border rounded px-3 py-2" 
          onClick={() => {
            setQ(''); 
            setBallotNumber(''); 
            setPanelId(''); 
            setDepartment(''); 
            setHall(''); 
            onChange({}); 
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';

export default function Admin() {
  const [apiKey, setApiKey] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);

  async function upload() {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/import', { 
      method: 'POST', 
      headers: { 'x-api-key': apiKey }, 
      body: fd 
    });
    setResult(await res.json());
  }

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Import</h1>
      <input 
        type="password" 
        placeholder="API Key" 
        className="border rounded px-2 py-2" 
        value={apiKey} 
        onChange={e => setApiKey(e.target.value)} 
      />
      <input 
        type="file" 
        accept=".json,.xlsx" 
        onChange={e => setFile(e.target.files?.[0] || null)} 
      />
      <button 
        className="border rounded px-3 py-2" 
        onClick={upload}
      >
        Upload
      </button>
      {result && (
        <pre className="bg-slate-100 p-3 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}

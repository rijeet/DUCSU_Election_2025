'use client';
export default function Modal({ open, onClose, title, children }: {
  open: boolean, 
  onClose: () => void, 
  title: string, 
  children: React.ReactNode 
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-3xl rounded-2xl bg-white p-4 md:p-6 shadow" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="px-3 py-1 rounded border">Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}

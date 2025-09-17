'use client';
import { POSITION_LABELS } from "@/lib/positions";

export default function PositionSquare({ positionKey, selectedCount = 0, max = 1, onClick }: {
  positionKey: string; 
  selectedCount?: number; 
  max?: number; 
  onClick?: () => void;
}) {
  const label = POSITION_LABELS[positionKey] ?? positionKey;
  return (
    <button onClick={onClick}
      className="aspect-square rounded-2xl border bg-white shadow hover:shadow-md transition grid place-items-center text-sm md:text-base p-2 relative">
      <span className="font-medium text-center">{label}</span>
      <span className="absolute bottom-1 right-2 text-xs opacity-70">{selectedCount}/{max}</span>
    </button>
  );
}

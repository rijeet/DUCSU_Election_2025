'use client';
import { useEffect, useState } from "react";
import { POSITION_LABELS, PYRAMID_LAYERS } from "@/lib/positions";

interface WinnerCandidate {
  _id: string;
  name: string;
  votesCount: number;
  imgUrl?: string;
  panelId?: string;
  positionKey: string;
}

interface WinnerPositionGroup {
  _id: string; // positionKey
  candidates: WinnerCandidate[];
}

export default function WinnerListPage() {
  const [winnerPositions, setWinnerPositions] = useState<WinnerPositionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWinners() {
      try {
        const response = await fetch('/api/winners');
        const data = await response.json();
        
        if (data.success) {
          setWinnerPositions(data.data);
        } else {
          setError(data.error || 'Failed to fetch winners');
        }
      } catch (err) {
        setError('Network error occurred');
        console.error('Error fetching winners:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchWinners();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 p-4">Loading winners...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-slate-50 p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 bg-[#cdfeff]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-wrap justify-between items-center bg-[#255811] p-4 rounded-xl text-white font-bold text-lg mb-4">
            <div>Voter: 39,874</div>
            <div>Casting Vote: 29821</div>
            <div>Turnout: 75%</div>
          </div>
        </header>

        <div className="space-y-6">
          {PYRAMID_LAYERS.map((row, i) => {
            const uniquePositionsInRow = Array.from(new Set(row)); // Ensure each position is processed only once per row
            return (
              <div key={i} className="flex gap-3 justify-center">
                {uniquePositionsInRow.map((posKey) => {
                  const positionWinners = winnerPositions.find(p => p._id === posKey);

                  if (!positionWinners || positionWinners.candidates.length === 0) {
                    return (
                      <div key={posKey} className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg border-2 border-slate-800">
                        <h2 className="text-xl font-semibold mb-2">{POSITION_LABELS[posKey] || posKey}</h2>
                        <p className="text-sm text-slate-500">No winner yet</p>
                      </div>
                    );
                  }

                  if (posKey === 'member') {
                    return positionWinners.candidates.map((candidate, index) => (
                      <div key={candidate._id} className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg border-2 border-slate-800">
                        {index === 0} 
                        <div className="flex flex-col items-center text-center p-2">
                          <h3 className="font-medium text-slate-800 text-sm leading-tight">
                            Member #{index + 1}
                          </h3>
                          <div className="w-20 h-20 mb-2 rounded-full overflow-hidden border-2 border-slate-300">
                            <img
                              src={candidate.imgUrl || '/placeholder.png'}
                              alt={candidate.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.png';
                              }}
                            />
                          </div>
                          <h3 className="font-semibold text-slate-900 text-sm leading-tight">
                            {candidate.name}
                          </h3>
                          <p className="text-xs text-red-600 font-bold">
                            Votes: {candidate.votesCount}
                          </p>
                          {candidate.panelId && (
                            <p className="text-xs text-blue-600 font-medium">
                              {candidate.panelId}
                            </p>
                          )}
                        </div>
                      </div>
                    ));
                  } else {
                    // For other positions, render a single box for the top candidate
                    const candidate = positionWinners.candidates[0]; // Assuming top 1 is always fetched
                    return (
                      <div key={posKey} className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg border-2 border-slate-800">
                        <h2 className="text-xl font-semibold mb-2">{POSITION_LABELS[posKey] || posKey}</h2>
                        <div className="flex flex-col items-center text-center p-2">
                          <div className="w-20 h-20 mb-2 rounded-full overflow-hidden border-2 border-slate-300">
                            <img
                              src={candidate.imgUrl || '/placeholder.png'}
                              alt={candidate.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.png';
                              }}
                            />
                          </div>
                          <h3 className="font-semibold text-slate-900 text-sm leading-tight">
                            {candidate.name}
                          </h3>
                          <p className="text-xs text-red-600 font-bold">
                            Votes: {candidate.votesCount}
                          </p>
                          {candidate.panelId && (
                            <p className="text-xs text-blue-600 font-medium">
                              {candidate.panelId}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

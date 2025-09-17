'use client';
import { useEffect, useState } from 'react';
import { POSITION_LABELS } from '@/lib/positions';

interface Candidate {
  _id: string;
  name: string;
  votesCount: number;
  imgUrl?: string;
  hall?: string;
  department?: string;
  panelId?: string;
}

interface PositionGroup {
  _id: string;
  candidates: Candidate[];
  count: number;
}

export default function CandidatesByPositionPage() {
  const [positions, setPositions] = useState<PositionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPositions, setExpandedPositions] = useState<Set<string>>(new Set());

  const toggleExpand = (positionId: string) => {
    setExpandedPositions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(positionId)) {
        newSet.delete(positionId);
      } else {
        newSet.add(positionId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const response = await fetch('/api/candidates-by-position');
        const data = await response.json();
        
        if (data.success) {
          setPositions(data.data);
        } else {
          setError(data.error || 'Failed to fetch candidates');
        }
      } catch (err) {
        setError('Network error occurred');
        console.error('Error fetching candidates:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCandidates();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading candidates...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 bg-[#cdfeff]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-slate-900">DUCSU Election 2025 - All Candidates</h1>
            <a className="underline" href="/"><img src="/home.png" alt="Home" className="h-8 w-8" /></a>
          </div>
          <p className="text-slate-600">
            Total Candidates: {positions.reduce((sum, pos) => sum + pos.count, 0)}
          </p>
        </header>

        <div className="space-y-12">
          {positions.map((position) => (
            <section key={position._id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {POSITION_LABELS[position._id] || position._id}
                </h2>
                <p className="text-slate-600">
                  {position.count} candidate{position.count !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {position.candidates.slice(0, expandedPositions.has(position._id) ? position.count : 5).map((candidate) => (
                  <div
                    key={candidate._id}
                    className="bg-slate-50 rounded-xl p-4 border-2 border-slate-800 hover:shadow-md transition-shadow hover:bg-[#ebf1e4]"
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Candidate Image */}
                      <div className="w-20 h-20 mb-3 rounded-full overflow-hidden border-2 border-slate-300">
                        <img
                          src={candidate.imgUrl || '/placeholder.png'}
                          alt={candidate.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.png';
                          }}
                        />
                      </div>

                      {/* Candidate Info */}
                      <div className="space-y-1">
                        <h3 className="font-semibold text-slate-900 text-sm leading-tight">
                          {candidate.name}
                        </h3>
                        <p className="text-xs text-red-600 font-bold">
                          Votes: {candidate.votesCount}
                        </p>
                        {candidate.hall && (
                          <p className="text-xs text-slate-500">
                            {candidate.hall}
                          </p>
                        )}
                        {candidate.department && (
                          <p className="text-xs text-slate-500">
                            {candidate.department}
                          </p>
                        )}
                        {candidate.panelId && (
                          <p className="text-xs text-blue-600 font-medium">
                            {candidate.panelId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {position.count > 5 && (
                <button
                  onClick={() => toggleExpand(position._id)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  {expandedPositions.has(position._id) ? 'Show Less' : 'Show All'}
                </button>
              )}
            </section>
          ))}
        </div>

        {positions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No candidates found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

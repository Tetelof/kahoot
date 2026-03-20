'use client';

import { Player } from '@/lib/gameStore';

interface ScoreboardProps {
  players: Player[];
  maxVisible?: number;
}

export function Scoreboard({ players, maxVisible = 10 }: ScoreboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const visiblePlayers = sortedPlayers.slice(0, maxVisible);
  const hasMore = players.length > maxVisible;

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-yellow-400 text-yellow-900';
      case 1:
        return 'bg-gray-300 text-gray-800';
      case 2:
        return 'bg-amber-600 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
        <h3 className="text-2xl font-bold text-white text-center">
          🏆 Leaderboard
        </h3>
      </div>
      
      <div className="p-4">
        {visiblePlayers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No players yet</p>
        ) : (
          <ul className="space-y-2">
            {visiblePlayers.map((player, index) => (
              <li
                key={player.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <span
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${getRankStyle(index)}`}
                >
                  {index + 1}
                </span>
                <span className="flex-1 text-lg font-semibold text-gray-800 truncate">
                  {player.name}
                </span>
                <span className="flex-shrink-0 text-xl font-bold text-blue-600">
                  {player.score.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
        
        {hasMore && (
          <p className="text-center text-gray-500 mt-4">
            +{players.length - maxVisible} more players
          </p>
        )}
      </div>
    </div>
  );
}

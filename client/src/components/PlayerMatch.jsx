import React from 'react';
import { User } from 'lucide-react';

const PlayerMatch = ({
  matchId,
  participant1_name,
  participant2_name,
  match_date,
  isCompleted,
  winnerId,
  participant1,
  participant2
}) => {

  const isWinner1 = winnerId === participant1;
  const isWinner2 = winnerId === participant2;

  return (
    <div className="bg-white rounded-lg border border-md shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center justify-center gap-8">
            {/* Participant 1 */}
            <div className="flex flex-col items-center gap-2 text-center min-w-[100px]">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
              <span className={`font-medium text-sm truncate w-full`}>
                {participant1_name}
              </span>
              {isWinner1 && (
                <div className="text-xs text-green-600">Переможець</div>
              )}
            </div>

            {/* VS Separator */}
            <div className="flex-col items-center">
              <div className="text-lg font-medium text-gray-500">vs</div>
            </div>

            {/* Participant 2 */}
            <div className="flex flex-col items-center gap-2 text-center min-w-[100px]">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
              <span className={`font-medium text-sm truncate w-full`}>
                {participant2_name}
              </span>
              {isWinner2 && (
                <div className="text-xs text-green-600">Переможець</div>
              )}
            </div>
          </div>
        </div>

        {/* Match Information */}
        <div className="ml-8 text-right min-w-[120px]">
          <div className="font-medium text-gray-900">{match_date}</div>
          <div className="text-sm text-gray-500">
            {isCompleted ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Завершено
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Очікується
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerMatch;

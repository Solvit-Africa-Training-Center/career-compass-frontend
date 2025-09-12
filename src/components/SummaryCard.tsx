import React from 'react';
import { SummaryCard as SummaryCardType } from '../types';

interface Props {
  card: SummaryCardType;
}

const SummaryCard: React.FC<Props> = ({ card }) => {
  const colorClasses = {
    orange: 'bg-orange-500',
    green: 'bg-green-500',
    red: 'bg-red-500'
  };

  return (
    <div className={`${colorClasses[card.color]} text-white p-6 rounded-lg shadow-md`}>
      <h3 className="text-lg font-medium mb-2">{card.title}</h3>
      <p className="text-3xl font-bold mb-1">{card.count}</p>
      {card.growth && (
        <p className="text-sm opacity-90">{card.growth}</p>
      )}
    </div>
  );
};

export default SummaryCard;
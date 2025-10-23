import { useState, useEffect } from 'react';
import { getUserRating, saveUserRating } from '@/lib/userRatings';
import { Company } from '@/lib/dataLoader';

interface InlineRatingProps {
  company: Company;
}

const ratingColors = [
  'bg-blue-500',
  'bg-red-500', 
  'bg-pink-500',
  'bg-yellow-500',
  'bg-orange-500',
  'bg-green-500',
  'bg-teal-500',
  'bg-purple-500',
  'bg-cyan-500',
  'bg-amber-500'
];

export default function InlineRating({ company }: InlineRatingProps) {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const userRating = getUserRating(company);
    setRating(userRating.rating);
  }, [company]);

  const handleSquareClick = (value: number) => {
    const existingRating = getUserRating(company);
    const updatedRating = {
      ...existingRating,
      rating: value,
      updatedAt: new Date().toISOString()
    };
    
    saveUserRating(company, updatedRating);
    setRating(value);
  };

  // Generate a consistent color pattern for this company
  const companyName = company['Company name'] || '';
  const colorSeed = companyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const renderSquares = () => {
    const squares = [];
    for (let i = 1; i <= 5; i++) {
      const colorIndex = (colorSeed + i) % ratingColors.length;
      const color = ratingColors[colorIndex];
      const isActive = i <= rating;
      
      squares.push(
        <button
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            handleSquareClick(i);
          }}
          className={`w-4 h-4 rounded-sm transition-opacity ${color} ${isActive ? 'opacity-100' : 'opacity-30'}`}
          title={`Rate ${i}`}
        />
      );
    }
    return squares;
  };

  return (
    <div className="flex items-center gap-1 py-1">
      {renderSquares()}
    </div>
  );
}


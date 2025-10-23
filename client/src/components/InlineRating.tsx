import { useState, useEffect } from 'react';
import { getUserRating, saveUserRating } from '@/lib/userRatings';
import { Company } from '@/lib/dataLoader';

interface InlineRatingProps {
  company: Company;
}

const RATING_COLORS = [
  'bg-blue-500',
  'bg-green-500', 
  'bg-yellow-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-cyan-500',
  'bg-teal-500',
  'bg-indigo-500',
];

export default function InlineRating({ company }: InlineRatingProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    const userRating = getUserRating(company);
    setRating(userRating.rating);
  }, [company]);

  const handleStarClick = (starValue: number) => {
    const existingRating = getUserRating(company);
    const updatedRating = {
      ...existingRating,
      rating: starValue,
      updatedAt: new Date().toISOString()
    };
    
    saveUserRating(company, updatedRating);
    setRating(starValue);
  };

  const renderColoredSquares = () => {
    const squares = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoveredStar || rating);
      const colorIndex = (i - 1) % RATING_COLORS.length;
      
      squares.push(
        <button
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            handleStarClick(i);
          }}
          onMouseEnter={() => setHoveredStar(i)}
          onMouseLeave={() => setHoveredStar(0)}
          className={`w-3 h-3 rounded-sm transition-all duration-150 hover:scale-110 ${
            isFilled 
              ? RATING_COLORS[colorIndex]
              : 'bg-muted border border-border'
          }`}
          title={`Rate ${i} star${i > 1 ? 's' : ''}`}
        />
      );
    }
    return squares;
  };

  return (
    <div className="flex items-center gap-1 py-1">
      {renderColoredSquares()}
      <span className="sr-only">
        {rating > 0 ? `Rated ${rating} out of 5 stars` : 'Not rated'}
      </span>
    </div>
  );
}


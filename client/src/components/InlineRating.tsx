import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { getUserRating, saveUserRating } from '@/lib/userRatings';
import { Company } from '@/lib/dataLoader';

interface InlineRatingProps {
  company: Company;
}

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

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoveredStar || rating);
      
      stars.push(
        <button
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            handleStarClick(i);
          }}
          onMouseEnter={() => setHoveredStar(i)}
          onMouseLeave={() => setHoveredStar(0)}
          className="transition-colors"
          title={`Rate ${i} star${i > 1 ? 's' : ''}`}
        >
          <Star 
            className={`w-4 h-4 ${isFilled ? 'fill-muted-foreground text-muted-foreground' : 'text-muted-foreground/40'}`}
          />
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="flex items-center gap-0.5 py-1">
      {renderStars()}
      <span className="sr-only">
        {rating > 0 ? `Rated ${rating} out of 5 stars` : 'Not rated'}
      </span>
    </div>
  );
}


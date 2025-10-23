import { useState, useEffect } from 'react';
import { Star, MessageSquare, Edit3 } from 'lucide-react';
import { getUserRating, saveUserRating } from '@/lib/userRatings';
import { Company } from '@/lib/dataLoader';

interface InlineRatingProps {
  company: Company;
  onRatingChange?: (data: any) => void;
}

export default function InlineRating({ company, onRatingChange }: InlineRatingProps) {
  const [rating, setRating] = useState(0);
  const [hasNote, setHasNote] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [showNoteButton, setShowNoteButton] = useState(false);

  useEffect(() => {
    const userRating = getUserRating(company);
    setRating(userRating.rating);
    setHasNote(!!userRating.note);
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
    
    if (onRatingChange) {
      onRatingChange(updatedRating);
    }
  };

  const handleNoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRatingChange) {
      onRatingChange({ openModal: true });
    }
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
          className={`transition-all duration-150 hover:scale-110 ${
            isFilled 
              ? 'text-yellow-400 hover:text-yellow-300' 
              : 'text-slate-600 hover:text-yellow-400'
          }`}
          title={`Rate ${i} star${i > 1 ? 's' : ''}`}
        >
          <Star 
            className={`w-4 h-4 ${isFilled ? 'fill-current' : ''}`} 
          />
        </button>
      );
    }
    return stars;
  };

  return (
    <div 
      className="flex items-center gap-1 py-1"
      onMouseEnter={() => setShowNoteButton(true)}
      onMouseLeave={() => setShowNoteButton(false)}
    >
      {/* Star Rating */}
      <div className="flex items-center gap-0.5">
        {renderStars()}
      </div>
      
      {/* Note Indicator/Button */}
      {(hasNote || showNoteButton) && (
        <button
          onClick={handleNoteClick}
          className={`ml-1 transition-all duration-150 hover:scale-110 ${
            hasNote 
              ? 'text-blue-400 hover:text-blue-300' 
              : 'text-slate-500 hover:text-blue-400'
          }`}
          title={hasNote ? 'Edit note' : 'Add note'}
        >
          {hasNote ? (
            <MessageSquare className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Edit3 className="w-3.5 h-3.5" />
          )}
        </button>
      )}
      
      {/* Rating Display for Screen Readers */}
      <span className="sr-only">
        {rating > 0 ? `Rated ${rating} out of 5 stars` : 'Not rated'}
        {hasNote && ', has note'}
      </span>
    </div>
  );
}


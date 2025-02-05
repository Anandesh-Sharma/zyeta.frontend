import { Star, Bot, Zap, Users, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Assistant } from '@/lib/store/assistants/types';
import { useState, useRef, useCallback } from 'react';
import { AssistantDetailsModal } from './assistant-details-modal';
import { Rating } from '@smastrom/react-rating';
import { RatingModal } from './rating-modal';
import '@smastrom/react-rating/style.css';

interface AssistantCardProps {
  assistant: Assistant & {
    rating?: number;
    usageCount?: string;
    tags?: string[];
    credits?: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}

export function AssistantCard({ assistant, isSelected, onSelect }: AssistantCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isRatingHovered, setIsRatingHovered] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const hoverTimeoutRef = useRef<number>();
  const Icon = assistant.icon || Bot;

  const handleReadMore = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(true);
  }, []);

  const handleRatingClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowRatingModal(true);
  }, []);

  const handleRatingMouseEnter = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);
    setIsRatingHovered(true);
  }, []);

  const handleRatingMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = window.setTimeout(() => {
      setIsRatingHovered(false);
    }, 300);
  }, []);

  const handleHoverRatingChange = useCallback((value: number) => {
    setHoveredRating(value);
    setShowRatingModal(true);
  }, []);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => e.key === 'Enter' && onSelect()}
        className={cn(
          'group flex items-start gap-3 p-4 rounded-lg text-left transition-all w-full border border-border hover:bg-muted/50 hover:shadow-md cursor-pointer',
          isSelected && 'ring-2 ring-primary bg-primary/5'
        )}
      >
        <div className={cn(
          'h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
          isSelected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
        )}>
          <Icon className="h-6 w-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-medium">{assistant.name}</span>
            {assistant.tags?.map(tag => (
              <span
                key={tag}
                className={cn(
                  'px-1.5 py-0.5 rounded-md text-xs font-medium',
                  tag === 'Core' 
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                )}
              >
                {tag}
              </span>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 group-hover:text-foreground transition-colors">
            {assistant.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs">
            {assistant.rating !== undefined && (
              <div 
                role="button"
                tabIndex={0}
                className="flex items-center gap-1.5 text-amber-500 relative cursor-pointer"
                onMouseEnter={handleRatingMouseEnter}
                onMouseLeave={handleRatingMouseLeave}
                onClick={handleRatingClick}
                onKeyDown={(e) => e.key === 'Enter' && handleRatingClick(e as any)}
              >
                <div className={cn(
                  'absolute -top-20 -left-2 bg-background border border-border rounded-md p-4 shadow-lg transition-all duration-200 min-w-[200px]',
                  isRatingHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                )}>
                  <Rating 
                    value={assistant.rating} 
                    onChange={handleHoverRatingChange}
                    style={{ maxWidth: 200 }}
                  />
                </div>
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="font-medium">{assistant.rating.toFixed(1)}</span>
              </div>
            )}
            {assistant.usageCount && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>{assistant.usageCount}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-muted-foreground ml-auto">
              <Zap className="h-3.5 w-3.5" />
              <span>{assistant.credits || 'Included'}</span>
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={handleReadMore}
              onKeyDown={(e) => e.key === 'Enter' && handleReadMore(e as any)}
              className="flex items-center gap-1 text-primary hover:text-primary/90 transition-colors cursor-pointer"
            >
              <span>Read More</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>

      <AssistantDetailsModal
        assistant={assistant}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />

      <RatingModal
        assistant={assistant}
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        initialRating={hoveredRating}
      />
    </>
  );
}
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Rating } from '@smastrom/react-rating';
import { Assistant } from '@/lib/store/assistants/types';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

interface RatingModalProps {
  assistant: Assistant & {
    rating?: number;
    usageCount?: string;
    tags?: string[];
    credits?: number;
  };
  isOpen: boolean;
  onClose: () => void;
  initialRating?: number;
}

export function RatingModal({ assistant, isOpen, onClose, initialRating = 0 }: RatingModalProps) {
  const [rating, setRating] = useState(initialRating);
  const [feedback, setFeedback] = useState('');
  const Icon = assistant.icon;

  useEffect(() => {
    if (isOpen && initialRating > 0) {
      setRating(initialRating);
    }
  }, [isOpen, initialRating]);

  const handleSubmit = () => {
    // Here you would typically send the rating and feedback to your backend
    console.log('Rating submitted:', { rating, feedback });
    onClose();
  };

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
      <Button 
        onClick={handleSubmit} 
        disabled={rating === 0} 
        icon={Star}
      >
        Submit Rating
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={assistant.name}
      description="Rate this assistant"
      icon={<Icon className="h-5 w-5 text-primary-foreground" />}
      footer={footer}
    >
      <div className="p-4 space-y-4">
        <div className="flex flex-col items-center gap-2">
          <Rating
            value={rating}
            onChange={setRating}
            style={{ maxWidth: 200 }}
          />
          <p className="text-sm text-muted-foreground">
            {rating === 0 && 'Select a rating'}
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Share your experience (optional)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What did you like or dislike about this assistant?"
            className="w-full px-3 py-2 rounded-md bg-muted border border-border focus:ring-1 focus:ring-ring text-sm min-h-[100px] resize-none"
          />
        </div>
      </div>
    </Modal>
  );
}
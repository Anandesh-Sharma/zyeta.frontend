import { memo, useState } from 'react';
import { Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message } from '@/lib/types/message';
import { MessageModal } from './modal';
import { Button } from '@/components/ui/button';

interface MessageActionsProps {
  message: Message;
  onRegenerate?: () => void;
}

export const MessageActions = memo(({ message, onRegenerate }: MessageActionsProps) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = (value: boolean) => {
    setLiked(value);
    // Here you would typically send this feedback to your backend
  };

  if (message.role === 'user' || message.streaming || message.status === 'loading') return null;

  return (
    <>
      <div className="flex items-center gap-1 mt-2">
        <Button
          variant="ghost"
          size="sm"
          icon={RotateCcw}
          onClick={onRegenerate}
        >
          Regenerate
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon={copied ? Check : Copy}
          onClick={handleCopy}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            icon={ThumbsUp}
            onClick={() => handleLike(true)}
            className={cn(liked === true && "text-primary")}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={ThumbsDown}
            onClick={() => handleLike(false)}
            className={cn(liked === false && "text-primary")}
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={Maximize2}
          onClick={() => setIsModalOpen(true)}
        >
          Expand
        </Button>
      </div>

      <MessageModal
        message={message}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRegenerate={onRegenerate}
        onCopy={handleCopy}
        copied={copied}
        liked={liked}
        onLike={handleLike}
      />
    </>
  );
});

MessageActions.displayName = 'MessageActions';
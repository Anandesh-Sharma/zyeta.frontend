import { Bot, User, Copy, Check, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Message } from '@/lib/types/message';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { CodeBlock } from '@/components/chat/blocks/code-block';
import { ImageBlock } from '@/components/chat/blocks/image-block';
import { VideoBlock } from '@/components/chat/blocks/video-block';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import { useChatSessions } from '@/lib/hooks/use-chat-sessions';

interface MessageModalProps {
  message: Message;
  isOpen: boolean;
  onClose: () => void;
  onRegenerate?: () => void;
  onCopy: () => void;
  copied: boolean;
  liked: boolean | null;
  onLike: (value: boolean) => void;
}

export function MessageModal({
  message,
  isOpen,
  onClose,
  onRegenerate,
  onCopy,
  copied,
  liked,
  onLike
}: MessageModalProps) {
  const { getSelectedAssistant } = useChatSessions();

  const assistant = useMemo(() => getSelectedAssistant(), [getSelectedAssistant]);  
  
  const Icon = message.role === 'user' ? User : Bot;

  const footer = (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          icon={RotateCcw}
          onClick={onRegenerate}
        >
          Regenerate
        </Button>
        <Button
          variant="ghost"
          icon={copied ? Check : Copy}
          onClick={onCopy}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          icon={ThumbsUp}
          onClick={() => onLike(true)}
          className={cn(liked === true && "text-primary")}
        >
          Helpful
        </Button>
        <Button
          variant="ghost"
          icon={ThumbsDown}
          onClick={() => onLike(false)}
          className={cn(liked === false && "text-primary")}
        >
          Not Helpful
        </Button>
      </div>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      title={message.role === 'user' ? 'You' : assistant?.name}
      description={new Date(message.timestamp).toLocaleString()}
      icon={<Icon className="h-5 w-5 text-primary-foreground" />}
      footer={footer}
    >
      <div className="p-4">
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <CodeBlock
                    language={match[1]}
                    value={String(children).replace(/\n$/, '')}
                  />
                ) : (
                  <code className="px-1.5 py-0.5 rounded-md bg-muted" {...props}>
                    {children}
                  </code>
                );
              },
              img({ src, alt }) {
                return src ? <ImageBlock src={src} alt={alt || ''} /> : null;
              },
              video({ src }) {
                return src ? <VideoBlock src={src} /> : null;
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </Modal>
  );
}
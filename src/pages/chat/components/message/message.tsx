import { Message } from '@/lib/types/message';
import { Bot, User } from 'lucide-react';
import { getAssistant } from '@/lib/constants/chat';
import { cn } from '@/lib/utils';
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { CodeBlock } from '@/components/chat/blocks/code-block';
import { ImageBlock } from '@/components/chat/blocks/image-block';
import { VideoBlock } from '@/components/chat/blocks/video-block';
import { MessageActions } from './actions';

interface ChatMessageProps {
  message: Message;
  onRegenerate?: () => void;
}

export const ChatMessage = memo(({ message, onRegenerate }: ChatMessageProps) => {
  const assistant = getAssistant(message.model);
  const Icon = message.role === 'user' ? User : (assistant?.icon || Bot);
  const isLoading = message.status === 'loading' && !message.streaming;
  const isUser = message.role === 'user';

  // Use model name from message if available, otherwise fallback to assistant name
  const modelName = useMemo(() => {
    if (isUser) return 'You';
    return message.modelName || assistant?.name || 'Assistant';
  }, [isUser, message.modelName, assistant]);

  // Pre-process the message content to extract media URLs and cache them
  const { content, mediaBlocks } = useMemo(() => {
    if (!message.content) return { content: '', mediaBlocks: new Map() };
    
    const blocks = new Map();
    let blockId = 0;
    
    const processedContent = message.content.replace(
      /!\[([^\]]*)\]\(([^)]+)\)|<img[^>]+src="([^"]+)"|<video[^>]+src="([^"]+)"/g,
      (match, alt, mdUrl, imgUrl, videoUrl) => {
        const url = mdUrl || imgUrl || videoUrl;
        const id = `block-${blockId++}`;
        if (url) {
          blocks.set(id, {
            type: videoUrl ? 'video' : 'image',
            url,
            alt: alt || ''
          });
          return `<div data-block-id="${id}"></div>`;
        }
        return match;
      }
    );
    
    return { content: processedContent, mediaBlocks: blocks };
  }, [message.content]);

  return (
    <div className="py-4 px-4 lg:px-6">
      <div className={cn(
        'flex gap-3 max-w-3xl mx-auto',
        isUser && 'flex-row-reverse'
      )}>
        <div className={cn(
          'w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5',
          isUser ? 'bg-primary' : 'bg-accent'
        )}>
          {isLoading ? (
            <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
          ) : (
            <Icon className="h-4 w-4 text-white" />
          )}
        </div>
        <div className={cn(
          'flex-1 min-w-0 space-y-1',
          isUser && 'text-right'
        )}>
          <div className={cn(
            'flex items-center gap-2',
            isUser && 'justify-end'
          )}>
            <span className="font-medium text-sm">{modelName}</span>
            {message.streaming && (
              <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                typing...
              </div>
            )}
          </div>
          {isLoading ? (
            <div className={cn(
              'space-y-2',
              isUser && 'flex flex-col items-end'
            )}>
              <div className="h-3 bg-accent rounded w-[80%] animate-pulse" />
              <div className="h-3 bg-accent rounded w-[60%] animate-pulse" />
              <div className="h-3 bg-accent rounded w-[70%] animate-pulse" />
            </div>
          ) : (
            <div className={cn(
              'text-sm leading-relaxed prose dark:prose-invert max-w-none prose-pre:my-0',
              isUser && 'flex flex-col items-end'
            )}>
              <div className={cn(
                'bg-background rounded-lg px-4 py-2 shadow-sm border border-border',
                isUser ? 'rounded-tr-none' : 'rounded-tl-none'
              )}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    p({ children }) {
                      return <span className="block mb-2 last:mb-0">{children}</span>;
                    },
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <CodeBlock
                          key={String(children)}
                          language={match[1]}
                          value={String(children).replace(/\n$/, '')}
                        />
                      ) : (
                        <code className="px-1.5 py-0.5 rounded-md bg-muted" {...props}>
                          {children}
                        </code>
                      );
                    },
                    div(props) {
                      const blockId = props['data-block-id'];
                      if (!blockId || !mediaBlocks.has(blockId)) return null;
                      
                      const block = mediaBlocks.get(blockId)!;
                      return block.type === 'video' ? (
                        <VideoBlock key={block.url} src={block.url} />
                      ) : (
                        <ImageBlock key={block.url} src={block.url} alt={block.alt} />
                      );
                    },
                    button(props) {
                      const { onClick, ...rest } = props;
                      return <button {...rest} />;
                    }
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          )}
          {!isUser && <MessageActions message={message} onRegenerate={onRegenerate} />}
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';
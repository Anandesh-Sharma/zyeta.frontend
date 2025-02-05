import { memo, useRef, useEffect } from 'react';
import { ExternalLink, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRecoilState } from 'recoil';
import { imageLoadingState } from '@/lib/store/media/atoms';

interface ImageBlockProps {
  src: string;
  alt: string;
}

export const ImageBlock = memo(({ src, alt }: ImageBlockProps) => {
  const [isExpanded, setIsExpanded] = useRecoilState(imageLoadingState(`expanded:${src}`));
  const [isLoaded, setIsLoaded] = useRecoilState(imageLoadingState(src));
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current?.complete) {
      setIsLoaded(true);
    }
  }, [src, setIsLoaded]);

  return (
    <figure className="inline-block align-top my-1 mr-2">
      <div className={cn(
        "relative group rounded-md border border-border overflow-hidden bg-muted/50",
        isExpanded ? "max-w-2xl" : "max-w-[180px]"
      )}>
        <div className="relative">
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            className={cn(
              "w-full h-auto object-cover transition-opacity duration-200",
              !isLoaded && "opacity-0",
              !isExpanded && "max-h-[120px]"
            )}
            onLoad={() => setIsLoaded(true)}
          />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center min-h-[120px]">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        {isLoaded && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-background/80 to-transparent flex items-end justify-end p-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => window.open(src, '_blank')}
                className="flex items-center gap-1 text-xs bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md hover:bg-accent transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                View
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-xs bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md hover:bg-accent transition-colors"
              >
                <Maximize2 className="h-3 w-3" />
                {isExpanded ? 'Collapse' : 'Expand'}
              </button>
            </div>
          </div>
        )}
      </div>
      {alt && <figcaption className="text-xs text-muted-foreground mt-1 truncate max-w-[180px]">{alt}</figcaption>}
    </figure>
  );
});

ImageBlock.displayName = 'ImageBlock';
import { memo, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useRecoilState } from 'recoil';
import { videoLoadingState } from '@/lib/store/media/atoms';

interface VideoBlockProps {
  src: string;
}

export const VideoBlock = memo(({ src }: VideoBlockProps) => {
  const [isLoaded, setIsLoaded] = useRecoilState(videoLoadingState(src));
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.readyState >= 2) {
      setIsLoaded(true);
    }

    const onLoadedData = () => setIsLoaded(true);
    video.addEventListener('loadeddata', onLoadedData);
    return () => video.removeEventListener('loadeddata', onLoadedData);
  }, [src, setIsLoaded]);

  return (
    <div className="my-4 rounded-lg border border-border overflow-hidden bg-muted/50">
      <div className="relative aspect-video">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <video
          ref={videoRef}
          controls
          className={cn(
            "absolute inset-0 w-full h-full object-contain transition-opacity duration-200",
            !isLoaded && "opacity-0"
          )}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
});

VideoBlock.displayName = 'VideoBlock';
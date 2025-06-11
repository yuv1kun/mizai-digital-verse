
import { cn } from "@/lib/utils";

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
}

export const TextShimmer = ({ children, className, speed = 'normal' }: TextShimmerProps) => {
  const speedClass = {
    slow: 'animate-[shimmer_3s_ease-in-out_infinite]',
    normal: 'animate-[shimmer_2s_ease-in-out_infinite]',
    fast: 'animate-[shimmer_1s_ease-in-out_infinite]'
  }[speed];

  return (
    <span
      className={cn(
        "inline-block bg-gradient-to-r from-transparent via-white/80 to-transparent bg-[length:200%_100%] bg-clip-text text-transparent",
        speedClass,
        className
      )}
      style={{
        backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
      }}
    >
      {children}
    </span>
  );
};

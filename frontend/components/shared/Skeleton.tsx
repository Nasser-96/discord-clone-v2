interface SkeletonProps {
  className?: string;
}
export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-opacity-10 bg-white ${className}`} />
  );
}

import type { CSSProperties, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  rounded?: boolean;
  circle?: boolean;
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
};

const dimension = (value: CSSProperties['width']) =>
  typeof value === 'number' ? `${value}px` : value;

export function Skeleton({
  className,
  rounded = true,
  circle = false,
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'serv-skeleton relative isolate overflow-hidden',
        rounded && 'rounded-md',
        circle && 'rounded-full',
        className,
      )}
      style={{ width: dimension(width), height: dimension(height), ...style }}
      {...props}
    />
  );
}

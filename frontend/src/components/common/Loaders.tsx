import React from 'react';
import { Loader2 } from 'lucide-react';

// ============================================
// SPINNER LOADER
// ============================================
export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
};

const colorClasses = {
  primary: 'text-blue-600 dark:text-blue-400',
  white: 'text-white',
  gray: 'text-gray-400 dark:text-gray-500',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  fullScreen = false,
}) => {
  const spinner = (
    <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-40">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-4">{spinner}</div>;
};

// ============================================
// SKELETON LOADER
// ============================================
export interface SkeletonProps {
  width?: string;
  height?: string;
  variant?: 'text' | 'circle' | 'rect';
  count?: number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  variant = 'rect',
  count = 1,
  className = '',
}) => {
  const skeletonItem = (
    <div
      className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${
        variant === 'circle' ? 'rounded-full' : 'rounded'
      } ${className}`}
      style={{
        width: variant === 'circle' ? height : width,
        height,
      }}
    />
  );

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>{skeletonItem}</div>
        ))}
      </div>
    );
  }

  return skeletonItem;
};

// ============================================
// SKELETON TABLE ROW
// ============================================
interface SkeletonTableRowProps {
  columns?: number;
  rows?: number;
}

export const SkeletonTableRow: React.FC<SkeletonTableRowProps> = ({
  columns = 4,
  rows = 3,
}) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={colIdx} width="100%" height="20px" />
          ))}
        </div>
      ))}
    </div>
  );
};

// ============================================
// SKELETON CARD
// ============================================
export interface SkeletonCardProps {
  count?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ count = 1 }) => {
  const card = (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <Skeleton height="24px" width="40%" className="mb-4" />
      <Skeleton height="16px" width="100%" className="mb-3" />
      <Skeleton height="16px" width="90%" className="mb-4" />
      <Skeleton height="40px" width="100%" />
    </div>
  );

  if (count > 1) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>{card}</div>
        ))}
      </div>
    );
  }

  return card;
};

// ============================================
// SKELETON LIST ITEM
// ============================================
export const SkeletonListItem: React.FC<{ count?: number }> = ({ count = 1 }) => {
  const item = (
    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <Skeleton variant="circle" height="40px" className="flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton height="16px" width="60%" className="mb-2" />
        <Skeleton height="14px" width="40%" />
      </div>
    </div>
  );

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>{item}</div>
        ))}
      </div>
    );
  }

  return item;
};

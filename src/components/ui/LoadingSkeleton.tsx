import React from 'react';

interface LoadingSkeletonProps {
  type?: 'text' | 'image' | 'video' | 'gallery';
  className?: string;
}

export default function LoadingSkeleton({ type = 'text', className = '' }: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';
  
  switch (type) {
    case 'image':
      return (
        <div className={`${baseClasses} ${className} aspect-video rounded-lg`} />
      );
    case 'video':
      return (
        <div className={`${baseClasses} ${className} aspect-video rounded-lg`} />
      );
    case 'gallery':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`${baseClasses} aspect-video rounded-lg`} />
          ))}
        </div>
      );
    default:
      return (
        <div className="space-y-3">
          <div className={`${baseClasses} h-4 w-3/4 rounded`} />
          <div className={`${baseClasses} h-4 w-1/2 rounded`} />
          <div className={`${baseClasses} h-4 w-2/3 rounded`} />
        </div>
      );
  }
} 
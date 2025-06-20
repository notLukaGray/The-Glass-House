"use client";

import React from 'react';
import { PerformanceMonitor, PerformanceMetrics } from '@/lib/utils/performance';

interface PerformanceMonitorProps {
  showInProduction?: boolean;
}

const PerformanceMonitorComponent: React.FC<PerformanceMonitorProps> = ({ 
  showInProduction = false 
}) => {
  const [metrics, setMetrics] = React.useState<Map<string, PerformanceMetrics>>(new Map());
  const [isVisible, setIsVisible] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const monitor = PerformanceMonitor.getInstance();

  React.useEffect(() => {
    // Only show in development or if explicitly enabled
    if (process.env.NODE_ENV !== 'development' && !showInProduction) {
      return;
    }

    const updateMetrics = () => {
      setMetrics(monitor.getMetrics() as Map<string, PerformanceMetrics>);
    };

    // Update metrics every 500ms for more responsive updates
    const interval = setInterval(updateMetrics, 500);
    
    // Show immediately in development
    setIsVisible(true);

    return () => {
      clearInterval(interval);
    };
  }, [monitor, showInProduction]);

  if (!isVisible || (process.env.NODE_ENV !== 'development' && !showInProduction)) {
    return null;
  }

  const averageLoadTime = monitor.getAverageLoadTime();
  const totalComponents = metrics.size;
  const sortedMetrics = Array.from(metrics.entries()).sort((a, b) => (b[1] as PerformanceMetrics).componentLoadTime - (a[1] as PerformanceMetrics).componentLoadTime);

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-95 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm border border-gray-600">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold">🚀 Performance Monitor</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-gray-700"
          >
            {isExpanded ? '−' : '+'}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white text-xs"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="text-xs space-y-1">
        <div className="flex justify-between">
          <span>Components Loaded:</span>
          <span className="font-mono">{totalComponents}</span>
        </div>
        <div className="flex justify-between">
          <span>Avg Load Time:</span>
          <span className="font-mono">{averageLoadTime.toFixed(1)}ms</span>
        </div>
        
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="text-gray-300 text-xs mb-2">Component Details:</div>
            {sortedMetrics.map(([name, metric]) => (
              <div key={name} className="flex justify-between items-center mb-1">
                <span className="truncate mr-2" title={name}>
                  {name.replace('Section', '')}:
                </span>
                <span className="font-mono text-green-400">
                  {(metric as PerformanceMetrics).componentLoadTime.toFixed(1)}ms
                </span>
              </div>
            ))}
            {sortedMetrics.length === 0 && (
              <div className="text-gray-500 text-xs italic">
                No components loaded yet...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceMonitorComponent; 
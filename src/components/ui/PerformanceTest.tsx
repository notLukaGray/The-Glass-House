"use client";

import React from 'react';
import { usePerformanceMonitor } from '@/lib/utils/performance';

const PerformanceTest: React.FC = () => {
  usePerformanceMonitor('PerformanceTest');
  
  return (
    <div className="p-4 border border-blue-300 bg-blue-50 rounded-lg">
      <h3 className="font-semibold text-blue-800">Performance Test Component</h3>
      <p className="text-blue-600 text-sm">This component is being monitored for performance.</p>
    </div>
  );
};

export default PerformanceTest; 
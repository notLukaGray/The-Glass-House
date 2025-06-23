import React from "react";

// Performance monitoring utilities

export interface PerformanceMetrics {
  componentLoadTime: number;
  bundleSize?: number;
  renderTime: number;
  memoryUsage?: number;
  loadStartTime?: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private loadStartTimes: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(componentName: string): () => void {
    const startTime = performance.now();
    this.loadStartTimes.set(componentName, startTime);

    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      this.metrics.set(componentName, {
        componentLoadTime: loadTime,
        renderTime: endTime - startTime,
        loadStartTime: startTime,
      });
    };
  }

  // Track lazy component loading
  trackLazyComponent(componentName: string): void {
    const startTime = performance.now();
    this.loadStartTimes.set(componentName, startTime);

    // Set initial metric
    this.metrics.set(componentName, {
      componentLoadTime: 0,
      renderTime: 0,
      loadStartTime: startTime,
    });
  }

  // Mark lazy component as loaded
  markLazyComponentLoaded(componentName: string): void {
    const startTime = this.loadStartTimes.get(componentName);
    if (startTime) {
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      this.metrics.set(componentName, {
        componentLoadTime: loadTime,
        renderTime: endTime - startTime,
        loadStartTime: startTime,
      });
    }
  }

  getMetrics(
    componentName?: string,
  ): PerformanceMetrics | Map<string, PerformanceMetrics> {
    if (componentName) {
      return (
        this.metrics.get(componentName) || {
          componentLoadTime: 0,
          renderTime: 0,
        }
      );
    }
    return this.metrics;
  }

  getAverageLoadTime(): number {
    const metrics = Array.from(this.metrics.values());
    if (metrics.length === 0) return 0;

    const totalTime = metrics.reduce(
      (sum, metric) => sum + metric.componentLoadTime,
      0,
    );
    return totalTime / metrics.length;
  }

  clearMetrics(): void {
    this.metrics.clear();
    this.loadStartTimes.clear();
  }
}

// React hook for performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const monitor = PerformanceMonitor.getInstance();

  React.useEffect(() => {
    const stopTimer = monitor.startTimer(componentName);

    return () => {
      stopTimer();
    };
  }, [componentName, monitor]);

  return monitor.getMetrics(componentName);
};

// Enhanced lazy loading with performance tracking
export const createLazyComponent = (
  importFn: () => Promise<{ default: React.ComponentType<unknown> }>,
  componentName: string,
) => {
  const monitor = PerformanceMonitor.getInstance();

  return React.lazy(() => {
    monitor.trackLazyComponent(componentName);
    return importFn().then((module) => {
      monitor.markLazyComponentLoaded(componentName);
      return module;
    });
  });
};

// Bundle size estimation (rough calculation)
export const estimateBundleSize = (componentName: string): number => {
  // This is a rough estimation - in a real app you'd use webpack-bundle-analyzer
  const sizeMap: Record<string, number> = {
    TextSection: 45, // ~45KB
    ImageSection: 38, // ~38KB
    PortfolioCard: 12, // ~12KB
    GallerySection: 15, // ~15KB
    VideoSection: 8, // ~8KB
    default: 5, // ~5KB for small components
  };

  return sizeMap[componentName] || sizeMap.default;
};

// Performance optimization utilities
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {},
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: "50px",
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
};

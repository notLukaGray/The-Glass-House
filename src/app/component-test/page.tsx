import React from 'react';
import Link from 'next/link';
import PerformanceTest from '@/components/ui/PerformanceTest';
import PerformanceMonitorComponent from '@/components/ui/PerformanceMonitor';

export const dynamic = 'force-dynamic';

async function getAllPages() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/content/pages`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

export default async function ComponentTestPage() {
  const allPages = await getAllPages();
  
  return (
    <>
      <PerformanceMonitorComponent />
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Component Test & Page Links</h1>
        
        {/* Performance Test Component */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Performance Test Component</h2>
          <PerformanceTest />
        </div>
        
        {/* Available Pages */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Pages</h2>
          {allPages.length === 0 ? (
            <div className="text-gray-500 p-4 border border-gray-200 rounded-lg">
              No pages found. Create some pages in Sanity Studio first.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allPages.map((page: Record<string, unknown>) => (
                <Link
                  key={page._id as string}
                  href={`/component-test/${(page.slug as { current?: string })?.current || page._id}`}
                  className="block p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-lg mb-2">
                    {(page.title as { en?: string })?.en || 'Untitled Page'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Slug: {(page.slug as { current?: string })?.current || 'No slug'}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Sections: {Array.isArray(page.sections) ? page.sections.length : 0}
                  </p>
                  <p className="text-xs text-gray-500">
                    {page.locked ? '🔒 Locked' : '✅ Published'}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">How to Use:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Click on any page link above to view that page</li>
            <li>• The performance monitor will track component loading</li>
            <li>• Check the browser console for detailed performance logs</li>
            <li>• Visit /debug for more detailed page information</li>
          </ul>
        </div>
      </main>
    </>
  );
} 
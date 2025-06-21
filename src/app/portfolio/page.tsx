import { Suspense, lazy } from 'react';
import { getPortfoliosServer } from '@/_lib/data/portfolio';

// Lazy load the PortfolioCard component
const PortfolioCard = lazy(() => import('@/components/ui/PortfolioCard'));

export const dynamic = 'force-dynamic';

// Loading fallback for portfolio cards
const PortfolioCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="aspect-w-16 aspect-h-9 bg-gray-200"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
    </div>
  </div>
);

export default async function PortfolioListPage() {
  const portfolios = await getPortfoliosServer();

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Portfolio</h1>
        <p className="text-xl text-gray-600">Explore my work and projects</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolios.map((portfolio) => (
          <Suspense key={portfolio._id} fallback={<PortfolioCardSkeleton />}>
            <PortfolioCard portfolio={portfolio} />
          </Suspense>
        ))}
      </div>
    </main>
  );
} 
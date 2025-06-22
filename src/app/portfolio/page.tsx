import Link from "next/link";
// TODO: Use new API route or shared client for portfolio data fetching if needed.

export default async function PortfolioPage() {
  // TODO: Implement proper data fetching using new API routes
  // const portfolios = await getPortfoliosDataServer();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Portfolio</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* TODO: Map through actual portfolios */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Sample Project</h2>
            <p className="text-gray-600 mb-4">
              This is a placeholder for portfolio data
            </p>
            <Link
              href="/portfolio/sample"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View Project
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

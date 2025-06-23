// Portfolio page - needs proper data fetching
import Link from "next/link";

export default function PortfolioPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Portfolio</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Portfolio items will go here */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Sample Project</h3>
          <p className="text-gray-600 mb-4">
            This is a placeholder for portfolio data.
          </p>
          <Link
            href="/portfolio/sample"
            className="text-blue-600 hover:underline"
          >
            View Project →
          </Link>
        </div>
      </div>
    </div>
  );
}

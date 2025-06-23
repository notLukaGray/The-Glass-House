// TODO: Use new API route or shared client for portfolio detail fetching if needed.

import { notFound } from "next/navigation";

export const revalidate = 0;

interface PageProps {
  params: {
    slug: string;
  };
}

export default function PortfolioDetailPage({ params }: PageProps) {
  // For now, just show the slug
  if (!params.slug) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Project: {params.slug}</h1>

      <div className="bg-white shadow rounded-lg p-8">
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">
            This is a placeholder for the {params.slug} project details. Project
            information and assets will be displayed here.
          </p>

          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Project Overview</h3>
            <p>Project details coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

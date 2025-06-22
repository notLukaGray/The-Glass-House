// TODO: Use new API route or shared client for portfolio detail fetching if needed.

export const revalidate = 0;

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // TODO: Implement proper data fetching using new API routes
  // const portfolio = await getPortfolioDataServer({ slug });

  // Show placeholder since data fetching is not implemented
  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Portfolio: {slug}</h1>
        <p className="text-xl text-gray-600">
          Portfolio data fetching not yet implemented. This will be connected to
          the new API routes.
        </p>
      </header>

      <div className="space-y-8">
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
          <p className="text-gray-600">
            This page will display portfolio content once the data fetching is
            implemented using the new API routes.
          </p>
        </div>
      </div>
    </main>
  );
}

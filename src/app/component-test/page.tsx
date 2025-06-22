import Link from "next/link";
// TODO: Use new API route or shared client for pages data fetching if needed.

export const dynamic = "force-dynamic";

export default async function ComponentTestPage() {
  // TODO: Implement proper data fetching using new API routes
  // const pages = await getPagesDataServer();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Component Test Pages</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* TODO: Map through actual pages */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Sample Page</h2>
            <p className="text-gray-600 mb-4">
              This is a placeholder for page data
            </p>
            <Link
              href="/component-test/sample"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View Page
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

// Component testing page
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ComponentTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Component Tests</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Test components will go here */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Sample Component</h3>
          <p className="text-gray-600 mb-4">
            This is a placeholder for component testing.
          </p>
          <Link
            href="/component-test/sample"
            className="text-blue-600 hover:underline"
          >
            Test Component →
          </Link>
        </div>
      </div>
    </div>
  );
}

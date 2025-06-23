// Component test detail page
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function ComponentTestDetailPage({ params }: PageProps) {
  // For now, just show the slug
  if (!params.slug) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Testing: {params.slug}</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Image Assets</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Image assets will be displayed here */}
            <div className="bg-gray-200 h-32 rounded flex items-center justify-center">
              <span className="text-gray-500">Image Placeholder</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">SVG Assets</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* SVG assets will be displayed here */}
            <div className="bg-gray-200 h-32 rounded flex items-center justify-center">
              <span className="text-gray-500">SVG Placeholder</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Video Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Video assets will be displayed here */}
            <div className="bg-gray-200 h-48 rounded flex items-center justify-center">
              <span className="text-gray-500">Video Placeholder</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

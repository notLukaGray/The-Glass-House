// TODO: Use new API route or shared client for component test data fetching if needed.

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ComponentTestPage({ params }: PageProps) {
  const { slug } = await params;

  // TODO: Implement proper data fetching using new API routes
  // const pageData = await getPageDataServer({ slug });
  // const imageAssets = await getImageAssetsServer();
  // const svgAssets = await getSvgAssetsServer();
  // const videoAssets = await getVideoAssetsServer();

  // if (!pageData) {
  //   notFound();
  // }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Component Test Page: {slug}</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Image Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* TODO: Map through actual image assets */}
              <div className="border rounded-lg p-4">
                <p className="text-gray-600">
                  Image assets will be displayed here
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">SVG Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* TODO: Map through actual SVG assets */}
              <div className="border rounded-lg p-4">
                <p className="text-gray-600">
                  SVG assets will be displayed here
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Video Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* TODO: Map through actual video assets */}
              <div className="border rounded-lg p-4">
                <p className="text-gray-600">
                  Video assets will be displayed here
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

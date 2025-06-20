import React from 'react';

export const dynamic = 'force-dynamic';

interface Page {
  _id: string;
  title?: { en: string };
  slug?: { current: string };
  publishedAt?: string;
  locked?: boolean;
  sections?: Array<{
    _id: string;
    title?: string;
    order?: number;
    content?: Array<{
      _key: string;
      _type: string;
    }>;
  }>;
}

async function getPages(): Promise<Page[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/pages`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json() as Page[];
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

export default async function DebugPage() {
  const pages = await getPages();

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Debug: Available Pages & Sections</h1>
      
      {pages.length === 0 ? (
        <div className="text-red-600">
          <h2 className="text-xl font-semibold mb-4">No pages found!</h2>
          <p>You need to create some pages in Sanity Studio first.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {pages.map((page) => (
            <div key={page._id} className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">
                {page.title?.en || 'Untitled Page'}
              </h2>
              <div className="text-sm text-gray-600 mb-4">
                <p>ID: {page._id}</p>
                <p>Slug: {page.slug?.current || 'No slug'}</p>
                <p>Published: {page.publishedAt || 'Not published'}</p>
                <p>Locked: {page.locked ? 'Yes' : 'No'}</p>
              </div>
              
              {page.sections && page.sections.length > 0 ? (
                <div>
                  <h3 className="font-semibold mb-2">Sections ({page.sections.length}):</h3>
                  <div className="space-y-2">
                    {page.sections.map((section) => (
                      <div key={section._id} className="ml-4 p-3 bg-gray-50 rounded">
                        <p className="font-medium">{section.title || section._id}</p>
                        <p className="text-sm text-gray-600">Order: {section.order || 'No order'}</p>
                        {section.content && section.content.length > 0 ? (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Content ({section.content.length} items):</p>
                            <ul className="ml-4 text-sm text-gray-600">
                              {section.content.map((item) => (
                                <li key={item._key}>• {item._type}</li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No content</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No sections</p>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Go to Sanity Studio and create a page</li>
          <li>• Add sections to the page</li>
          <li>• Add content to the sections</li>
          <li>• Visit /component-test to see the components in action</li>
        </ul>
      </div>
    </main>
  );
} 
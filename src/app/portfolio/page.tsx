import { client } from '@/_lib/sanity';
import Link from 'next/link';
import { getImageAsset } from '@/handlers/imageHandler';

interface PortfolioPreview {
  _id: string;
  title: { en: string };
  subhead: { en: string };
  slug: { current: string };
  coverAsset: { _ref: string };
  featured: boolean;
  categories: Array<{ _id: string; title: { en: string } }>;
  tags: Array<{ _id: string; title: { en: string } }>;
}

async function getPortfolios() {
  const query = `*[_type == "projectMeta"] | order(featured desc, _createdAt desc) {
    _id,
    title,
    subhead,
    slug,
    coverAsset,
    featured,
    categories[]-> {
      _id,
      title
    },
    tags[]-> {
      _id,
      title
    }
  }`;

  const portfolios = await client.fetch<PortfolioPreview[]>(query);
  return portfolios;
}

export default async function PortfolioListPage() {
  const portfolios = await getPortfolios();

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Portfolio</h1>
        <p className="text-xl text-gray-600">Explore my work and projects</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolios.map(async (portfolio) => {
          const coverImage = portfolio.coverAsset ? await getImageAsset({ id: portfolio.coverAsset._ref }) : null;

          return (
            <Link
              key={portfolio._id}
              href={`/portfolio/${portfolio.slug.current}`}
              className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                {coverImage ? (
                  <img
                    src={coverImage.url}
                    alt={portfolio.title.en}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {portfolio.title.en}
                </h2>
                {portfolio.subhead && (
                  <p className="text-gray-600 mb-4">{portfolio.subhead.en}</p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {portfolio.categories?.map((category) => (
                    <span
                      key={category._id}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                    >
                      {category.title.en}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
} 
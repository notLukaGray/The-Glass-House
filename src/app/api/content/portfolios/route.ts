import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

// Create server-side Sanity client
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || '',
  apiVersion: process.env.SANITY_API_VERSION || '',
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
});

interface PortfolioPreview {
  _id: string;
  title: { en: string };
  subhead: { en: string };
  slug: { current: string };
  coverAsset: { _ref: string };
  featured: boolean;
  locked: boolean;
  categories: Array<{ _id: string; title: { en: string } }>;
  tags: Array<{ _id: string; title: { en: string } }>;
}

export async function GET() {
  try {
    const query = `*[_type == "projectMeta"] | order(featured desc, _createdAt desc) {
      _id,
      title,
      subhead,
      slug,
      coverAsset,
      featured,
      locked,
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
    
    return NextResponse.json(portfolios || []);
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolios' },
      { status: 500 }
    );
  }
} 
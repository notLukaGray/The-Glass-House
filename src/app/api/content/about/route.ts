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

interface AboutData {
  user?: unknown;
  sections?: Array<{
    _key: string;
    _type: string;
    items?: Array<{
      _key: string;
      _type: string;
      icon?: {
        _id: string;
        svgData: string;
        color: string;
      };
      logo?: {
        _id: string;
        svgData: string;
        color: string;
      };
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  }>;
}

export async function GET(): Promise<NextResponse> {
  try {
    const query = `*[_type == "about"][0]{
      user,
      sections[]{
        ...,
        items[]{
          ...,
          icon->{
            _id,
            svgData,
            color
          },
          logo->{
            _id,
            svgData,
            color
          }
        }
      }
    }`;
    
    const aboutData = await client.fetch<AboutData>(query);
    
    if (!aboutData) {
      return NextResponse.json({ error: 'About data not found' }, { status: 404 });
    }

    return NextResponse.json(aboutData);
  } catch (error) {
    console.error('Error fetching about data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about data' },
      { status: 500 }
    );
  }
} 
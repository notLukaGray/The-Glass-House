import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

// Create server-side Sanity client
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || '',
  apiVersion: process.env.SANITY_API_VERSION || '',
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json({ error: 'Page slug is required' }, { status: 400 });
    }

    let query: string;
    
    if (slug === 'test') {
      // For test page, get the first pageMeta document with resolved sections
      query = `*[_type == "pageMeta"][0]{
        _id,
        title,
        subhead,
        sections[]->{
          _id,
          order,
          content[] {
            ...,
            image,
            video,
            icon,
            avatar
          }
        }
      }`;
    } else {
      // For regular pages, get by slug
      query = `*[_type == "pageMeta" && slug.current == $slug][0]{
        _id,
        title,
        subhead,
        sections[]->{
          _id,
          order,
          content[] {
            ...,
            image,
            video,
            icon,
            avatar
          }
        }
      }`;
    }
    
    const pageData = await client.fetch<{
      _id: string;
      slug: string;
      title: string;
      content?: unknown;
      [key: string]: unknown;
    }>(query, { slug });
    
    if (!pageData) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(pageData);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
} 
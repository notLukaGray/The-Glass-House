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

export interface SocialAsset {
  _id: string;
  _type: string; // e.g., 'website', 'assetSocial', etc.
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name: string;
  url: string;
  icon?: { _ref: string; _type: 'reference' };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'website';
    const ids = searchParams.getAll('ids');
    
    let groqQuery = `*[_type == $type`;
    
    if (ids && ids.length > 0) {
      const idList = ids.map(id => `"${id}"`).join(', ');
      groqQuery += ` && _id in [${idList}]`;
    }
    
    groqQuery += `] | order(_createdAt asc)`;
    
    const assets = await client.fetch<SocialAsset[]>(groqQuery, { type });
    
    return NextResponse.json(assets || []);
  } catch (error) {
    console.error('Error fetching social assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social assets' },
      { status: 500 }
    );
  }
} 
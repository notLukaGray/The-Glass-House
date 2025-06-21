import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || '',
  apiVersion: process.env.SANITY_API_VERSION || '',
  useCdn: true,
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });
    }

    // Check for photo asset
    const photoAsset = await client.fetch(`*[_type == "assetPhoto" && _id == $id][0]`, { id });
    
    if (photoAsset) {
      return NextResponse.json({
        type: 'assetPhoto',
        found: true,
        asset: photoAsset
      });
    }

    // Check for SVG asset
    const svgAsset = await client.fetch(`*[_type == "assetSVG" && _id == $id][0]`, { id });
    
    if (svgAsset) {
      return NextResponse.json({
        type: 'assetSVG',
        found: true,
        asset: svgAsset
      });
    }

    // Check for any asset with this ID
    const anyAsset = await client.fetch(`*[_id == $id][0]`, { id });
    
    if (anyAsset) {
      return NextResponse.json({
        type: anyAsset._type,
        found: true,
        asset: anyAsset
      });
    }

    return NextResponse.json({
      found: false,
      message: `No asset found with ID: ${id}`
    });

  } catch (error) {
    console.error('Error checking asset:', error);
    return NextResponse.json(
      { error: 'Failed to check asset' },
      { status: 500 }
    );
  }
} 
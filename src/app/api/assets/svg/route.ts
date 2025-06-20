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

export interface SvgAsset {
  _id: string;
  _type: 'assetSVG';
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: {
    _type: 'localeString';
    en: string;
  };
  description: {
    _type: 'localeString';
    en: string;
  };
  caption: {
    _type: 'localeString';
    en: string;
  };
  color: string;
  order: number;
  svgData: string;
}

function normalizeSvg(svgData: string): string {
  if (!svgData) return '';
  let normalized = svgData.trim();
  // Remove XML declaration, DOCTYPE, comments
  normalized = normalized.replace(/<\?xml[^>]*>/g, '');
  normalized = normalized.replace(/<!DOCTYPE[^>]*>/gi, '');
  normalized = normalized.replace(/<!--([\s\S]*?)-->/g, '');
  // Extract the <svg>...</svg> content
  const svgMatch = normalized.match(/<svg[\s\S]*?<\/svg>/i);
  if (!svgMatch) return '';
  const svgContent = svgMatch[0];

  // Extract width/height if present
  let viewBox = '';
  const viewBoxMatch = svgContent.match(/viewBox="([^"]*)"/i);
  if (viewBoxMatch) {
    viewBox = viewBoxMatch[1];
  } else {
    // Try to infer from width/height
    const widthMatch = svgContent.match(/width="([0-9.]+)"/i);
    const heightMatch = svgContent.match(/height="([0-9.]+)"/i);
    if (widthMatch && heightMatch) {
      viewBox = `0 0 ${widthMatch[1]} ${heightMatch[1]}`;
    } else {
      viewBox = '0 0 100 100';
    }
  }

  // Only keep allowed shape elements
  const shapeRegex = /<(path|rect|circle|ellipse|polygon|polyline|line)([\s\S]*?)(\/>|<\/\1>)/gi;
  let shapes = '';
  let match;
  while ((match = shapeRegex.exec(svgContent)) !== null) {
    const tag = match[1];
    const attrs = match[2];
    // Only keep essential attributes
    let allowedAttrs = '';
    const attrRegex = /(d|points|x|y|r|cx|cy|rx|ry|x1|y1|x2|y2)="([^"]*)"/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrs)) !== null) {
      allowedAttrs += ` ${attrMatch[1]}="${attrMatch[2]}"`;
    }
    shapes += `<${tag}${allowedAttrs} />`;
  }

  // Build clean SVG
  const cleanSvg = `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${shapes}</svg>`;
  return cleanSvg;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const color = searchParams.get('color');
    const order = searchParams.get('order');
    
    let groqQuery = `*[_type == "assetSVG"`;
    
    if (title) {
      groqQuery += ` && title.en match "${title}"`;
    }
    if (color) {
      groqQuery += ` && color == "${color}"`;
    }
    if (order !== null) {
      groqQuery += ` && order == ${order}`;
    }
    
    groqQuery += `] | order(order asc)`;
    
    const assets = await client.fetch<SvgAsset[]>(groqQuery);
    
    if (assets) {
      assets.forEach(asset => {
        if (asset.svgData) {
          asset.svgData = normalizeSvg(asset.svgData);
        }
      });
    }
    
    return NextResponse.json(assets || []);
  } catch (error) {
    console.error('Error fetching SVG assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SVG assets' },
      { status: 500 }
    );
  }
} 
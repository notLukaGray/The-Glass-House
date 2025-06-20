import { client } from '@/lib/handlers/sanity';

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

export interface SvgAssetQuery {
  id?: string;
  title?: string;
  color?: string;
  order?: number;
}

export function normalizeSvg(svgData: string): string {
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

  // Remove any potentially dangerous tags and attributes
  const cleanSvgContent = cleanSvg.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  return cleanSvgContent;
}

export async function getSvgAsset(query: SvgAssetQuery): Promise<SvgAsset | null> {
  const { id, title, color, order } = query;
  
  let groqQuery = `*[_type == "assetSVG"`;
  
  if (id) {
    groqQuery += ` && _id == "${id}"`;
  }
  if (title) {
    groqQuery += ` && title.en match "${title}"`;
  }
  if (color) {
    groqQuery += ` && color == "${color}"`;
  }
  if (order !== undefined) {
    groqQuery += ` && order == ${order}`;
  }
  
  groqQuery += `][0]`;
  
  try {
    const asset = await client.fetch<SvgAsset>(groqQuery);
    if (asset && asset.svgData) {
      asset.svgData = normalizeSvg(asset.svgData);
    }
    return asset || null;
  } catch (error) {
    console.error('Error fetching SVG asset:', error);
    return null;
  }
}

export async function getSvgAssets(query?: Partial<SvgAssetQuery>): Promise<SvgAsset[]> {
  let groqQuery = `*[_type == "assetSVG"`;
  
  if (query) {
    const { title, color, order } = query;
    
    if (title) {
      groqQuery += ` && title.en match "${title}"`;
    }
    if (color) {
      groqQuery += ` && color == "${color}"`;
    }
    if (order !== undefined) {
      groqQuery += ` && order == ${order}`;
    }
  }
  
  groqQuery += `] | order(order asc)`;
  
  try {
    const assets = await client.fetch<SvgAsset[]>(groqQuery);
    if (assets) {
      assets.forEach(asset => {
        if (asset.svgData) {
          asset.svgData = normalizeSvg(asset.svgData);
        }
      });
    }
    return assets || [];
  } catch (error) {
    console.error('Error fetching SVG assets:', error);
    return [];
  }
}

export function getColoredSvg(svgData: string, color: string): string {
  // Normalize SVG before applying color
  let cleanedSvg = normalizeSvg(svgData);
  
  // Remove all style tags and their contents
  cleanedSvg = cleanedSvg.replace(/<style>[\s\S]*?<\/style>/g, '');
  
  // Remove all defs and their contents
  cleanedSvg = cleanedSvg.replace(/<defs>[\s\S]*?<\/defs>/g, '');
  
  // Remove all gradient definitions
  cleanedSvg = cleanedSvg
    .replace(/<linearGradient[\s\S]*?<\/linearGradient>/g, '')
    .replace(/<radialGradient[\s\S]*?<\/radialGradient>/g, '')
    .replace(/<stop[\s\S]*?\/>/g, '');
  
  // Remove all class attributes
  cleanedSvg = cleanedSvg.replace(/class="[^"]*"/g, '');
  
  // Remove all fill-related attributes
  cleanedSvg = cleanedSvg
    .replace(/fill="[^"]*"/g, '')
    .replace(/fill-opacity="[^"]*"/g, '')
    .replace(/fill-rule="[^"]*"/g, '')
    .replace(/style="[^"]*fill:[^"]*"/g, 'style=""');
  
  // Remove all gradient-related attributes
  cleanedSvg = cleanedSvg
    .replace(/gradientUnits="[^"]*"/g, '')
    .replace(/gradientTransform="[^"]*"/g, '')
    .replace(/x1="[^"]*"/g, '')
    .replace(/y1="[^"]*"/g, '')
    .replace(/x2="[^"]*"/g, '')
    .replace(/y2="[^"]*"/g, '')
    .replace(/offset="[^"]*"/g, '')
    .replace(/stop-color="[^"]*"/g, '');
  
  // Remove all stroke-related attributes
  cleanedSvg = cleanedSvg
    .replace(/stroke="[^"]*"/g, '')
    .replace(/stroke-width="[^"]*"/g, '')
    .replace(/stroke-linecap="[^"]*"/g, '')
    .replace(/stroke-linejoin="[^"]*"/g, '')
    .replace(/stroke-opacity="[^"]*"/g, '')
    .replace(/stroke-dasharray="[^"]*"/g, '')
    .replace(/stroke-dashoffset="[^"]*"/g, '')
    .replace(/style="[^"]*stroke:[^"]*"/g, 'style=""');
  
  // Add our color as both fill and stroke to all paths and shapes
  cleanedSvg = cleanedSvg
    .replace(/<path/g, `<path fill="#${color}" stroke="#${color}"`)
    .replace(/<rect/g, `<rect fill="#${color}" stroke="#${color}"`)
    .replace(/<circle/g, `<circle fill="#${color}" stroke="#${color}"`)
    .replace(/<ellipse/g, `<ellipse fill="#${color}" stroke="#${color}"`)
    .replace(/<polygon/g, `<polygon fill="#${color}" stroke="#${color}"`)
    .replace(/<polyline/g, `<polyline fill="#${color}" stroke="#${color}"`)
    .replace(/<line/g, `<line fill="#${color}" stroke="#${color}"`);
  
  return cleanedSvg;
}
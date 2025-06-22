import { client } from "@/lib/handlers/sanity";

export interface ImageAsset {
  _id: string;
  _type: "assetPhoto";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: {
    _type: "localeString";
    en: string;
  };
  description: {
    _type: "localeString";
    en: string;
  };
  caption: {
    _type: "localeString";
    en: string;
  };
  order: number;
  url: string;
}

export interface ImageAssetQuery {
  id?: string;
  title?: string;
  order?: number;
}

export async function getImageAsset(
  query: ImageAssetQuery,
): Promise<ImageAsset | null> {
  const { id, title, order } = query;

  let groqQuery = `*[_type == "assetPhoto"`;

  if (id) {
    groqQuery += ` && _id == "${id}"`;
  }
  if (title) {
    groqQuery += ` && title.en match "${title}"`;
  }
  if (order !== undefined) {
    groqQuery += ` && order == ${order}`;
  }

  groqQuery += `][0]`;

  try {
    const asset = await client.fetch<ImageAsset>(groqQuery);
    return asset || null;
  } catch (error) {
    console.error("Error fetching image asset:", error);
    return null;
  }
}

export async function getImageAssets(
  query?: Partial<ImageAssetQuery>,
): Promise<ImageAsset[]> {
  let groqQuery = `*[_type == "assetPhoto"`;

  if (query) {
    const { title, order } = query;

    if (title) {
      groqQuery += ` && title.en match "${title}"`;
    }
    if (order !== undefined) {
      groqQuery += ` && order == ${order}`;
    }
  }

  groqQuery += `] | order(order asc)`;

  try {
    const assets = await client.fetch<ImageAsset[]>(groqQuery);
    return assets || [];
  } catch (error) {
    console.error("Error fetching image assets:", error);
    return [];
  }
}

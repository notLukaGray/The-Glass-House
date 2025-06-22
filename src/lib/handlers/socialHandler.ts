import { client } from "@/lib/handlers/sanity";

export interface SocialAsset {
  _id: string;
  _type: string; // e.g., 'website', 'assetSocial', etc.
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name: string;
  url: string;
  icon?: { _ref: string; _type: "reference" };
}

export interface SocialAssetQuery {
  id?: string;
  ids?: string[];
  type?: string; // e.g., 'website', 'assetSocial', etc.
}

export async function getSocialAsset(
  query: SocialAssetQuery,
): Promise<SocialAsset | null> {
  const { id, type } = query;
  let groqQuery = `*[_type == "${type || "website"}"`;
  if (id) {
    groqQuery += ` && _id == "${id}"`;
  }
  groqQuery += `][0]`;
  try {
    const asset = await client.fetch<SocialAsset>(groqQuery);
    return asset || null;
  } catch (error) {
    console.error("Error fetching social asset:", error);
    return null;
  }
}

export async function getSocialAssets(
  query: SocialAssetQuery,
): Promise<SocialAsset[]> {
  const { ids, type } = query;
  let groqQuery = `*[_type == "${type || "website"}"`;
  if (ids && ids.length > 0) {
    const idList = ids.map((id) => `\"${id}\"`).join(", ");
    groqQuery += ` && _id in [${idList}]`;
  }
  groqQuery += `] | order(_createdAt asc)`;
  try {
    const assets = await client.fetch<SocialAsset[]>(groqQuery);
    return assets || [];
  } catch (error) {
    console.error("Error fetching social assets:", error);
    return [];
  }
}

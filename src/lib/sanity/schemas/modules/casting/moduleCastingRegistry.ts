import { createCastingFields } from "../../objects/casting/sharedCastingFields";

export const moduleCastingRegistry: Record<string, unknown[]> = {
  moduleHeroImage: createCastingFields("module"),
  moduleTextBlock: createCastingFields("module"),
  moduleImage: createCastingFields("module"),

  // Add more mappings as you create new modules
};

import { createCastingFields } from "../../objects/sharedCastingFields";

export const moduleCastingRegistry: Record<string, unknown[]> = {
  moduleHeroImage: createCastingFields("module"),
  moduleTestCasting: createCastingFields("module"),
  // Add more mappings as you create new modules
};

import { createCastingFields } from "../../objects/sharedCastingFields";

export const wingCastingRegistry: Record<string, unknown[]> = {
  wingsTestCasting: createCastingFields("wing"),
  // Add more mappings as you create new wings
};

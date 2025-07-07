import { createCastingFields } from "../../objects/casting/sharedCastingFields";

export const wingCastingRegistry: Record<string, unknown[]> = {
  wingsTestCasting: createCastingFields("wing"),
  // Add more mappings as you create new wings
};

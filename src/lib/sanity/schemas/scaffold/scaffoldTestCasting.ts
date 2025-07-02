import { createBaseScaffoldSchema } from "./baseScaffoldSchema";

// Test scaffold to demonstrate the new modular casting system
export const scaffoldTestCasting = createBaseScaffoldSchema(
  "scaffoldTestCasting",
  "Test Casting Scaffold",
  "test",
  // Additional fields - we'll add casting fields manually instead
  [],
  // Additional fieldsets
  [],
  // This will use the default scaffold casting fields from createCastingFields('scaffold')
);

export default scaffoldTestCasting;

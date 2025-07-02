import { createBaseWingSchema } from "./baseWingSchema";
import { createCastingWingSchema } from "./castingWingSchema";

// Test wing to demonstrate the new modular casting system
export const wingsTestCasting = createBaseWingSchema(
  "wingsTestCasting",
  "Test Casting Wing",
  [
    // Casting capabilities (modules with casting)
    ...createCastingWingSchema(),
  ],
  // This will use the default wing casting fields from createCastingFields('wing')
);

export default wingsTestCasting;

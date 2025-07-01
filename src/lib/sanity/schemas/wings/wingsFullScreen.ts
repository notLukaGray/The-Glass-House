import { createBaseWingSchema } from "./baseWingSchema";
import { createCastingWingSchema } from "./castingWingSchema";

// Full-screen wing - takes up the entire viewport
export const wingsFullScreen = createBaseWingSchema(
  "wingsFullScreen",
  "Full Screen Wing",
  [
    // Casting capabilities (just modules for now)
    ...createCastingWingSchema(),
  ],
);

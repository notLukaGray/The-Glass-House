// Modules index - export all module schemas
export { moduleHeroImage } from "./moduleHeroImage";
export { moduleTextBlock } from "./moduleTextBlock";
export { moduleImage } from "./moduleImage";
export { default as moduleDynamicBackground } from "./moduleDynamicBackground";
export { createBaseModuleSchema } from "./baseModuleSchema";
export { castingFields } from "./castingModuleSchema";

// Export all modules as an array
import { moduleHeroImage } from "./moduleHeroImage";
import { moduleTextBlock } from "./moduleTextBlock";
import { moduleImage } from "./moduleImage";
import moduleDynamicBackground from "./moduleDynamicBackground";

export const modules = [
  moduleHeroImage,
  moduleTextBlock,
  moduleImage,
  moduleDynamicBackground,
];

export default modules;

// Modules index - export all module schemas
export { moduleHeroImage } from "./moduleHeroImage";
export { createBaseModuleSchema } from "./baseModuleSchema";
export { castingFields } from "./castingModuleSchema";
export { moduleTestCasting } from "./moduleTestCasting";

// Export all modules as an array
import { moduleHeroImage } from "./moduleHeroImage";
import { moduleTestCasting } from "./moduleTestCasting";

export const modules = [moduleHeroImage, moduleTestCasting];

export default modules;

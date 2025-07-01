// Modules index - export all module schemas
export { moduleHeroImage } from "./moduleHeroImage";
export { createBaseModuleSchema } from "./baseModuleSchema";
export { castingFields } from "./castingModuleSchema";

// Export all modules as an array
import { moduleHeroImage } from "./moduleHeroImage";

export const modules = [moduleHeroImage];

export default modules;

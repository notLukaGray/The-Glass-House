// Wings index - export all wing schemas
export { createBaseWingSchema } from "./baseWingSchema";
export { createCastingWingSchema } from "./castingWingSchema";
export { wingsTestCasting } from "./wingsTestCasting";

// Export all wings as an array
import { wingsTestCasting } from "./wingsTestCasting";

export const wings = [wingsTestCasting];

export default wings;

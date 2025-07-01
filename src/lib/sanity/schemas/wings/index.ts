// Wings index - export all wing schemas
export { wingsFullScreen } from "./wingsFullScreen";
export { createBaseWingSchema } from "./baseWingSchema";
export { createCastingWingSchema } from "./castingWingSchema";

// Export all wings as an array
import { wingsFullScreen } from "./wingsFullScreen";

export const wings = [wingsFullScreen];

export default wings;

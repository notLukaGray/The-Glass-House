// Scaffold index - export all scaffold schemas
export { createBaseScaffoldSchema } from "./baseScaffoldSchema";
export { scaffoldTestCasting } from "./scaffoldTestCasting";

// Export all scaffolds as an array
import { scaffoldTestCasting } from "./scaffoldTestCasting";

export const scaffolds = [scaffoldTestCasting];

export default scaffolds;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import castRefModuleObject from "./casting/castRefModuleObject";

// Casting mechanics for wings - what wings can provide to modules
// Using the new modular casting system
export const createCastingWingSchema = () => {
  return [
    {
      name: "modules",
      title: "Modules",
      type: "array",
      description: "Modules placed in this wing with casting variables",
      of: [{ type: "castRefModuleObject" }],
    },
  ];
};

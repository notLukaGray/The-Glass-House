// eslint-disable-next-line @typescript-eslint/no-unused-vars
import castRefWingObject from "./casting/castRefWingObject";

// Casting mechanics for scaffolds - what scaffolds can provide to wings
// Using the new modular casting system
export const createCastingScaffoldSchema = () => {
  return [
    {
      name: "wings",
      title: "Wings",
      type: "array",
      description: "Wings placed in this scaffold with casting variables",
      of: [{ type: "castRefWingObject" }],
    },
  ];
};

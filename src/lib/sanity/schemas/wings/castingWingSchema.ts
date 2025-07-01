import ModuleArrayInput from "./components/ModuleArrayInput";
import { castingFields } from "../modules/castingModuleSchema";

// Casting mechanics for wings - what wings can provide to modules
export const createCastingWingSchema = () => {
  return [
    {
      name: "modules",
      title: "Modules",
      type: "array",
      description: "Modules placed in this wing",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "module",
              type: "reference",
              to: [{ type: "moduleHeroImage" }],
              options: {
                disableNew: false,
              },
            },
            {
              name: "layout",
              type: "object",
              fields: castingFields,
              description:
                "Layout and positioning for this module within the wing",
            },
          ],
        },
      ],
      components: {
        input: ModuleArrayInput,
      },
    },
  ];
};

import ModuleArrayInput from "./components/ModuleArrayInput";

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
              // TEMP: Add a dummy field to satisfy Sanity's requirement
              fields: [
                {
                  name: "dummy",
                  type: "string",
                  title: "Dummy (replace with real layout fields)",
                },
              ],
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

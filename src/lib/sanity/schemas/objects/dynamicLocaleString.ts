import { DynamicLocaleStringInput } from "../../components/DynamicLocaleStringInput";

const dynamicLocaleString = {
  name: "dynamicLocaleString",
  type: "object",
  title: "Dynamic Localized String",
  fields: [{ name: "en", type: "string", title: "English" }],
  components: {
    input: DynamicLocaleStringInput,
  },
};

export default dynamicLocaleString;

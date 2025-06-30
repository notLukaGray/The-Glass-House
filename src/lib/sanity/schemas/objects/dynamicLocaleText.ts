import { DynamicLocaleTextInput } from "../../components/DynamicLocaleTextInput";

const dynamicLocaleText = {
  name: "dynamicLocaleText",
  type: "object",
  title: "Dynamic Localized Text",
  fields: [{ name: "en", type: "text", title: "English" }],
  components: {
    input: DynamicLocaleTextInput,
  },
};

export default dynamicLocaleText;

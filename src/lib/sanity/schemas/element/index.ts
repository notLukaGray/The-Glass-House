import elementImage from "./elementImage";
// import elementVideo from "./elementVideo";
import elementTextSingleLine from "./elementTextSingleLine";
import elementTextBlock from "./elementTextBlock";
import elementRichText from "./elementRichText";
import elementButton from "./elementButton";
import elementSVG from "./elementSVG";

const element = [
  elementImage,
  // elementVideo,
  elementTextSingleLine,
  elementTextBlock,
  elementRichText,
  elementButton,
  elementSVG,
  // Add more elements here as we create them:
  // elementText,
  // elementAudio,
  // etc.
];

export default element;
export {
  elementImage,
  // elementVideo,
  elementTextSingleLine,
  elementTextBlock,
  elementRichText,
  elementButton,
  elementSVG,
  // Export individual elements for direct imports
};

import * as React from "react";
import Svg, { Path } from "react-native-svg";

const FacebookMessage = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color="#000000" fill="none" {...props}>
    <Path
      d="M20 4C20 3.44772 19.5523 3 19 3H5C4.44772 3 4 3.44772 4 4V16C4 16.5523 4.44772 17 5 17H16L19.5 20V17H19C19.5523 17 20 16.5523 20 16V4Z"
      stroke="currentColor"
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default FacebookMessage;

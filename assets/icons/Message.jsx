import * as React from "react";
import Svg, { Path } from "react-native-svg";

const Message = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color="#000000" fill="none" {...props}>
    <Path
      d="M20 2H4C2.89543 2 2 2.89543 2 4V16C2 17.1046 2.89543 18 4 18H6V21.586L10.293 17.293C10.6834 16.9026 11.3166 16.9026 11.707 17.293L16 21.586V18H20C21.1046 18 22 17.1046 22 16V4C22 2.89543 21.1046 2 20 2Z"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinejoin="round"
    />
  </Svg>
);

export default Message;

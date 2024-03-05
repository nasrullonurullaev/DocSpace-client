import styled from "styled-components";

import CrossReactSvg from "PUBLIC_DIR/images/cross.react.svg";

import { commonIconsStyles } from "../../utils";

const StyledCrossIcon = styled(CrossReactSvg)`
  ${commonIconsStyles}

  path {
    fill: #999976;
  }
`;

export default StyledCrossIcon;

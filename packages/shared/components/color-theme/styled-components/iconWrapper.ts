import styled, { css } from "styled-components";

import { TColorScheme } from "../../../themes";

import StyledIconWrapper from "../sub-components/StyledIconWrapper";

const getDefaultStyles = ({
  $currentColorScheme,
}: {
  $currentColorScheme?: TColorScheme;
}) =>
  $currentColorScheme &&
  css`
    svg {
      path:nth-child(2) {
        fill: ${$currentColorScheme.main?.accent};
      }
      circle {
        stroke: ${$currentColorScheme.main?.accent};
      }
    }
  `;

export default styled(StyledIconWrapper)(getDefaultStyles);

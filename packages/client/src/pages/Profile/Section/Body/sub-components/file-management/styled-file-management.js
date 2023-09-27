import styled, { css } from "styled-components";
import { tablet } from "@docspace/components/utils/device";
import { isMobile } from "react-device-detect";

const StyledWrapper = styled.div`
  max-width: 660px;

  width: 100%;

  display: grid;
  grid-gap: 32px;

  .toggle-btn {
    position: relative;
  }

  .heading {
    margin-bottom: -2px;
    margin-top: 0;
  }

  .toggle-button-text {
    margin-top: -1px;
  }

  .settings-section {
    display: grid;
    grid-gap: 12px;
  }
`;

export default StyledWrapper;

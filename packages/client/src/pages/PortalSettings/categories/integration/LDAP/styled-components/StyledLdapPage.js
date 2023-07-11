import styled from "styled-components";
import { UnavailableStyles } from "../../../../utils/commonSettingsStyles";
import Box from "@docspace/components/box";

const StyledLdapPage = styled(Box)`
  max-width: 700px;
  width: 100%;

  .intro-text {
    color: ${(props) => props.theme.client.settings.common.descriptionColor};
  }

  .toggle {
    position: static;
    margin-top: 1px;
  }

  .toggle-caption {
    display: flex;
    flex-direction: column;
    gap: 4px;
    .toggle-caption_title {
      display: flex;
      .toggle-caption_title_badge {
        margin-left: 4px;
        cursor: auto;
      }
    }
  }

  .hide-button {
    margin-left: 12px;
  }

  ${(props) => !props.isSettingPaid && UnavailableStyles}
`;

export default StyledLdapPage;

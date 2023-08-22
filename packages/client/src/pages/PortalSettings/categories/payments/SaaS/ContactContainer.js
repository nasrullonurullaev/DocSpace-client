import React from "react";

import { inject, observer } from "mobx-react";
import { ColorTheme, ThemeType } from "@docspace/components/ColorTheme";
import Text from "@docspace/components/text";
import { StyledContactContainer } from "./StyledComponent";

const ContactContainer = ({ t, salesEmail }) => {
  return (
    <StyledContactContainer>
      {salesEmail && (
        <Text as="span" noSelect fontWeight={600}>
          {t("ContactUs")}
          <ColorTheme
            className="sales-email-link"
            tag="a"
            themeId={ThemeType.Link}
            fontWeight="600"
            href={`mailto:${salesEmail}`}
          >
            {salesEmail}
          </ColorTheme>
        </Text>
      )}
    </StyledContactContainer>
  );
};

export default inject(({ payments, auth }) => {
  const { salesEmail } = payments;
  return {
    salesEmail,
    theme: auth.settingsStore.theme,
  };
})(observer(ContactContainer));

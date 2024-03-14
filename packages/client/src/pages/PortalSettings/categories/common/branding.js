import React, { useEffect } from "react";
import { withTranslation } from "react-i18next";

import { inject, observer } from "mobx-react";

import withLoading from "SRC_DIR/HOCs/withLoading";
import { setDocumentTitle } from "SRC_DIR/helpers/utils";
import Whitelabel from "./Branding/whitelabel";
import CompanyInfoSettings from "./Branding/companyInfoSettings";
import styled from "styled-components";
import AdditionalResources from "./Branding/additionalResources";
import { isManagement } from "@docspace/shared/utils/common";
import LoaderBrandingDescription from "./sub-components/loaderBrandingDescription";

import MobileView from "./Branding/MobileView";

import { UnavailableStyles } from "../../utils/commonSettingsStyles";
import { resetSessionStorage } from "../../utils";
import { DeviceType } from "@docspace/shared/enums";

const StyledComponent = styled.div`
  max-width: 700px;
  width: 100%;
  font-weight: 400;
  font-size: ${(props) => props.theme.getCorrectFontSize("13px")};

  .header {
    font-weight: 700;
    font-size: ${(props) => props.theme.getCorrectFontSize("16px")};
    line-height: 22px;
    padding-bottom: 9px;
  }

  .description {
    padding-bottom: 16px;
  }

  .settings-block {
    max-width: 433px;
  }

  .section-description {
    color: ${(props) =>
      props.theme.client.settings.common.brandingDescriptionColor};
    line-height: 20px;
    padding-bottom: 20px;
  }

  hr {
    margin: 24px 0;
    border: none;
    border-top: ${(props) => props.theme.client.settings.separatorBorder};
  }

  ${(props) => !props.isSettingPaid && UnavailableStyles}
`;

const Branding = ({
  t,
  isLoadedCompanyInfoSettingsData,
  isSettingPaid,
  standalone,
  currentDeviceType,
  portals,
}) => {
  const isMobileView = currentDeviceType === DeviceType.mobile;

  useEffect(() => {
    setDocumentTitle(t("Branding"));
  }, []);

  useEffect(() => {
    return () => {
      if (!window.location.pathname.includes("customization")) {
        resetSessionStorage();
      }
    };
  }, []);

  if (isMobileView)
    return (
      <MobileView isSettingPaid={isSettingPaid} isManagement={isManagement()} />
    );

  const hideBlock = isManagement() ? false : portals?.length > 1 ? true : false;
  return (
    <StyledComponent isSettingPaid={isSettingPaid}>
      <Whitelabel />
      {standalone && !hideBlock && (
        <>
          <hr />
          {isLoadedCompanyInfoSettingsData ? (
            <div className="section-description settings_unavailable">
              {t("Settings:BrandingSectionDescription")}
            </div>
          ) : (
            <LoaderBrandingDescription />
          )}
          <CompanyInfoSettings />
          <AdditionalResources />
        </>
      )}
    </StyledComponent>
  );
};

export default inject(({ settingsStore, currentQuotaStore, common }) => {
  const { isBrandingAndCustomizationAvailable } = currentQuotaStore;
  const { isLoadedCompanyInfoSettingsData } = common;
  const { standalone, currentDeviceType, portals } = settingsStore;

  return {
    isLoadedCompanyInfoSettingsData,
    isSettingPaid: isBrandingAndCustomizationAvailable,
    standalone,
    currentDeviceType,
    portals,
  };
})(withLoading(withTranslation(["Settings", "Common"])(observer(Branding))));

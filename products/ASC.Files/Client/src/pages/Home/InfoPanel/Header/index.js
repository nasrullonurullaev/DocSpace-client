import IconButton from "@appserver/components/icon-button";
import Text from "@appserver/components/text";
import React from "react";
import { withTranslation } from "react-i18next";
import { inject, observer } from "mobx-react";
import {
  StyledInfoPanelHeader,
  StyledInfoPanelToggleWrapper,
} from "./styles/styles";
import Loaders from "@appserver/common/components/Loaders";
import withLoader from "../../../../HOCs/withLoader";
import Submenu from "@appserver/components/submenu";

const InfoPanelHeaderContent = ({
  t,
  setIsVisible,
  setRoomState,
  isGallery,
  isRoom,
}) => {
  const closeInfoPanel = () => setIsVisible(false);

  return (
    <StyledInfoPanelHeader isRoom={isRoom}>
      <div className="main">
        <Text className="header-text" fontSize="21px" fontWeight="700">
          {isRoom
            ? t("Room")
            : isGallery
            ? t("FormGallery:FormTemplateInfo")
            : t("Common:Info")}
        </Text>
        <StyledInfoPanelToggleWrapper
          isRootFolder={true}
          isInfoPanelVisible={true}
        >
          <div className="info-panel-toggle-bg">
            <IconButton
              className="info-panel-toggle"
              iconName="images/panel.react.svg"
              size="16"
              isFill={true}
              onClick={closeInfoPanel}
            />
          </div>
        </StyledInfoPanelToggleWrapper>
      </div>

      {isRoom && (
        <div className="submenu">
          <Submenu
            style={{ width: "100%" }}
            data={[
              {
                content: null,
                onClick: () => setRoomState("members"),
                id: "Members",
                name: "Members",
              },
              {
                content: null,
                onClick: () => setRoomState("history"),
                id: "History",
                name: "History",
              },
              {
                content: null,
                onClick: () => setRoomState("details"),
                id: "Details",
                name: "Details",
              },
            ]}
          />
        </div>
      )}
    </StyledInfoPanelHeader>
  );
};

export default inject(({ auth }) => {
  const { setIsVisible, setRoomState } = auth.infoPanelStore;
  return { setIsVisible, setRoomState };
})(
  withTranslation(["Common", "FormGallery"])(
    withLoader(observer(InfoPanelHeaderContent))(
      <Loaders.InfoPanelHeaderLoader />
    )
  )
);

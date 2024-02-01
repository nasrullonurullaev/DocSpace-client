import { useRef } from "react";
import { withTranslation } from "react-i18next";

import { Text } from "@docspace/shared/components/text";
import { inject, observer } from "mobx-react";
import PersonPlusReactSvgUrl from "PUBLIC_DIR/images/person+.react.svg?url";
import Planet12ReactSvgUrl from "PUBLIC_DIR/images/icons/12/planet.react.svg?url";
import { IconButton } from "@docspace/shared/components/icon-button";
import { StyledTitle } from "../../../styles/common";
import { RoomIcon } from "@docspace/shared/components/room-icon";
import RoomsContextBtn from "./context-btn";
import {
  FolderType,
  RoomsType,
  ShareAccessRights,
} from "@docspace/shared/enums";

const RoomsItemHeader = ({
  t,
  selection,
  infoPanelSelection,
  setIsMobileHidden,
  isGracePeriod,
  setInvitePanelOptions,
  setInviteUsersWarningDialogVisible,
  isPublicRoomType,
  roomsView,
  setSelected,
  setBufferSelection,
  isArchive,
  hasLinks,
}) => {
  const itemTitleRef = useRef();

  if (!selection) return null;

  const icon = selection.icon;
  const isLoadedRoomIcon = !!selection.logo?.medium;
  const showDefaultRoomIcon = !isLoadedRoomIcon && selection.isRoom;
  const security = infoPanelSelection ? infoPanelSelection.security : {};
  const canInviteUserInRoomAbility = security?.EditAccess;
  const showInviteUserIcon = selection?.isRoom && roomsView === "info_members";
  const showPlanetIcon =
    (selection.roomType === RoomsType.PublicRoom ||
      selection.roomType === RoomsType.CustomRoom) &&
    hasLinks;

  const badgeUrl = showPlanetIcon ? Planet12ReactSvgUrl : null;

  const onSelectItem = () => {
    setSelected("none");
    setBufferSelection(selection);
  };

  const onClickInviteUsers = () => {
    setIsMobileHidden(true);
    const parentRoomId = infoPanelSelection.id;

    if (isGracePeriod) {
      setInviteUsersWarningDialogVisible(true);
      return;
    }

    setInvitePanelOptions({
      visible: true,
      roomId: parentRoomId,
      hideSelector: false,
      defaultAccess: isPublicRoomType
        ? ShareAccessRights.RoomManager
        : ShareAccessRights.ReadOnly,
    });
  };

  return (
    <StyledTitle ref={itemTitleRef}>
      <div className="item-icon">
        <RoomIcon
          color={selection.logo?.color}
          title={selection.title}
          isArchive={isArchive}
          showDefault={showDefaultRoomIcon}
          imgClassName={`icon ${selection.isRoom && "is-room"}`}
          imgSrc={icon}
          badgeUrl={badgeUrl ? badgeUrl : ""}
        />
      </div>

      <Text className="text">{selection.title}</Text>

      <div className="info_title-icons">
        {canInviteUserInRoomAbility && showInviteUserIcon && (
          <IconButton
            id="info_add-user"
            className={"icon"}
            title={t("Common:AddUsers")}
            iconName={PersonPlusReactSvgUrl}
            isFill={true}
            onClick={onClickInviteUsers}
            size={16}
          />
        )}

        <RoomsContextBtn
          selection={selection}
          itemTitleRef={itemTitleRef}
          onSelectItem={onSelectItem}
        />
      </div>
    </StyledTitle>
  );
};

export default inject(
  ({
    auth,
    dialogsStore,
    selectedFolderStore,
    filesStore,
    publicRoomStore,
  }) => {
    const { infoPanelSelection, roomsView } = auth.infoPanelStore;
    const { externalLinks } = publicRoomStore;

    const selection = infoPanelSelection.length > 1 ? null : infoPanelSelection;
    const isArchive = selection?.rootFolderType === FolderType.Archive;

    return {
      selection,
      roomsView,
      infoPanelSelection: auth.infoPanelStore.infoPanelSelection,
      setIsMobileHidden: auth.infoPanelStore.setIsMobileHidden,

      isGracePeriod: auth.currentTariffStatusStore.isGracePeriod,

      setInvitePanelOptions: dialogsStore.setInvitePanelOptions,
      setInviteUsersWarningDialogVisible:
        dialogsStore.setInviteUsersWarningDialogVisible,

      isPublicRoomType:
        (selectedFolderStore.roomType ??
          auth.infoPanelStore.infoPanelSelection?.roomType) ===
        RoomsType.PublicRoom,

      setSelected: filesStore.setSelected,
      setBufferSelection: filesStore.setBufferSelection,
      isArchive,
      hasLinks: externalLinks.length,
    };
  }
)(
  withTranslation([
    "Files",
    "Common",
    "Translations",
    "InfoPanel",
    "SharingPanel",
  ])(observer(RoomsItemHeader))
);

import { useRef } from "react";
import { withTranslation } from "react-i18next";

import { Text } from "@docspace/components";
import { inject, observer } from "mobx-react";
import PersonPlusReactSvgUrl from "PUBLIC_DIR/images/person+.react.svg?url";
import IconButton from "@docspace/components/icon-button";
import ItemContextOptions from "./ItemContextOptions";
import { StyledTitle } from "../../styles/common";
import RoomIcon from "@docspace/components/room-icon";

import { RoomsType, ShareAccessRights } from "@docspace/common/constants";

const FilesItemTitle = ({
  t,
  selection,
  isSeveralItems,
  selectionParentRoom,
  setIsMobileHidden,
  isGracePeriod,
  setInvitePanelOptions,
  setInviteUsersWarningDialogVisible,
  isPublicRoomType,
  roomsView,
}) => {
  const itemTitleRef = useRef();

  if (isSeveralItems) return null;

  const icon = selection.icon;
  const isLoadedRoomIcon = !!selection.logo?.medium;
  const showDefaultRoomIcon = !isLoadedRoomIcon && selection.isRoom;
  const security = selectionParentRoom ? selectionParentRoom.security : {};
  const canInviteUserInRoomAbility = security?.EditAccess;
  const showInviteUserIcon = selection?.isRoom && roomsView === "info_members";

  const onClickInviteUsers = () => {
    setIsMobileHidden(true);
    const parentRoomId = selectionParentRoom.id;

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
        {showDefaultRoomIcon ? (
          <RoomIcon
            color={selection.logo.color}
            title={selection.title}
            isArchive={selection.isArchive}
          />
        ) : (
          <img
            className={`icon ${selection.isRoom && "is-room"}`}
            src={icon}
            alt="thumbnail-icon"
          />
        )}
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
        {selection && (
          <ItemContextOptions
            t={t}
            itemTitleRef={itemTitleRef}
            selection={selection}
          />
        )}
      </div>
    </StyledTitle>
  );
};

export default inject(({ auth, dialogsStore, selectedFolderStore }) => {
  const { selectionParentRoom, setIsMobileHidden, roomsView } =
    auth.infoPanelStore;
  const { isGracePeriod } = auth.currentTariffStatusStore;

  const { setInvitePanelOptions, setInviteUsersWarningDialogVisible } =
    dialogsStore;

  const roomType =
    selectedFolderStore.roomType ?? selectionParentRoom?.roomType;

  const isPublicRoomType = roomType === RoomsType.PublicRoom;

  return {
    selectionParentRoom,
    setIsMobileHidden,
    isGracePeriod,
    setInvitePanelOptions,
    setInviteUsersWarningDialogVisible,
    isPublicRoomType,
    roomsView,
  };
})(
  withTranslation([
    "Files",
    "Common",
    "Translations",
    "InfoPanel",
    "SharingPanel",
  ])(observer(FilesItemTitle))
);

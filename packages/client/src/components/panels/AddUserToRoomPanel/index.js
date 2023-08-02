import React from "react";
import Aside from "@docspace/components/aside";
import PeopleSelector from "@docspace/client/src/components/PeopleSelector";
import i18n from "./i18n";
import { ShareAccessRights } from "@docspace/common/constants";
import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";

const AddUserToRoomPanel = ({
  visible,
  onClose,
  roomId,
  setRoomSecurity,
  existUsers,
  fetchMembers,
}) => {
  const t = i18n.getFixedT(null, ["StartFillingPanel"]);
  const onAddToRoom = (users) => {
    const access = ShareAccessRights.FormFilling;

    const items = [];

    for (let item of users) {
      const newItem = {
        access: access,
        email: item.email,
        id: item.id,
        displayName: item.label,
        avatar: item.avatar,
        isOwner: item.isOwner,
        isAdmin: item.isAdmin,
      };
      items.push(newItem);
    }

    const invitations = items.map((item) => {
      let newItem = {};

      newItem.access = item.access;

      item.avatar ? (newItem.id = item.id) : (newItem.email = item.email);

      return newItem;
    });

    const data = {
      invitations,
    };

    data.notify = true;
    data.message = "Invitation message";

    setRoomSecurity(roomId, data)
      .catch((e) => {
        console.log("e", e);
      })
      .finally(() => {
        fetchMembers();
        onClose();
      });
  };

  return (
    <>
      <Aside
        visible={visible}
        withoutBodyScroll
        zIndex={410}
        isCloseable={false}
      >
        <PeopleSelector
          headerLabel={t("StartFillingPanel:AddUserToRoom")}
          visible={visible}
          onBackClick={onClose}
          zIndex={410}
          onAccept={onAddToRoom}
          existUsers={existUsers}
          acceptButtonLabel={t("StartFillingPanel:AddToRoom")}
          isMultiSelect
          withSelectAll={false}
          withSelectExistUsers
          withExpectedUsersExcluded
        />
      </Aside>
    </>
  );
};

export default inject(({ filesStore }) => {
  const { setRoomSecurity } = filesStore;

  return {
    setRoomSecurity,
  };
})(withTranslation(["StartFillingPanel"])(observer(AddUserToRoomPanel)));
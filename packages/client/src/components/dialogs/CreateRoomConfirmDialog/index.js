// (c) Copyright Ascensio System SIA 2009-2024
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import React, { useState, useEffect } from "react";
import { ModalDialog } from "@docspace/shared/components/modal-dialog";
import { withTranslation } from "react-i18next";
import { inject, observer } from "mobx-react";
import { Button } from "@docspace/shared/components/button";

const CreateRoomConfirmDialog = ({
  t,

  visible,
  setVisible,

  confirmDialogIsLoading,
  onCreateRoom,
}) => {
  const onContinue = async () => {
    await onCreateRoom(true);
    onClose();
  };

  const onClose = () => setVisible(false);

  return (
    <ModalDialog
      visible={visible || confirmDialogIsLoading}
      onClose={onClose}
      isLarge
      zIndex={310}
    >
      <ModalDialog.Header>{t("Common:Warning")}</ModalDialog.Header>
      <ModalDialog.Body>
        {t("CreateEditRoomDialog:CreateRoomConfirmation")}
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          label={t("Common:ContinueButton")}
          size="normal"
          primary
          isLoading={confirmDialogIsLoading}
          onClick={onContinue}
        />
        <Button
          label={t("Common:CancelButton")}
          size="normal"
          onClick={onClose}
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default inject(({ dialogsStore, createEditRoomStore }) => {
  const {
    createRoomConfirmDialogVisible: visible,
    setCreateRoomConfirmDialogVisible: setVisible,
  } = dialogsStore;

  const { confirmDialogIsLoading, onCreateRoom } = createEditRoomStore;

  return {
    visible,
    setVisible,

    confirmDialogIsLoading,
    onCreateRoom,
  };
})(withTranslation(["Common", "Files"])(observer(CreateRoomConfirmDialog)));

import React from "react";
import { useTranslation } from "react-i18next";
import { inject, observer } from "mobx-react";
import {
  SharingPanel,
  UploadPanel,
  VersionHistoryPanel,
  ChangeOwnerPanel,
  NewFilesPanel,
  HotkeyPanel,
  InvitePanel,
  StatusFillingPanel,
} from "../panels";
import {
  ConnectDialog,
  DeleteThirdPartyDialog,
  EmptyTrashDialog,
  DeleteDialog,
  DownloadDialog,
  ConflictResolveDialog,
  ConvertDialog,
  CreateRoomDialog,
  InviteUsersWarningDialog,
  CreateRoomConfirmDialog,
  ChangeUserTypeDialog,
  DeleteAllFormsDialog,
  DeleteFormDialog,
} from "../dialogs";
import ConvertPasswordDialog from "../dialogs/ConvertPasswordDialog";
import ArchiveDialog from "../dialogs/ArchiveDialog";
import RestoreRoomDialog from "../dialogs/RestoreRoomDialog";
import PreparationPortalDialog from "../dialogs/PreparationPortalDialog";
import FilesSelector from "../FilesSelector";
import { FilesSelectorFilterTypes } from "@docspace/common/constants";

const Panels = (props) => {
  const {
    uploadPanelVisible,
    sharingPanelVisible,
    ownerPanelVisible,
    copyPanelVisible,
    moveToPanelVisible,
    thirdPartyMoveDialogVisible,
    connectDialogVisible,
    deleteThirdPartyDialogVisible,
    versionHistoryPanelVisible,
    deleteDialogVisible,
    downloadDialogVisible,
    emptyTrashDialogVisible,
    newFilesPanelVisible,
    conflictResolveDialogVisible,
    convertDialogVisible,
    createMasterForm,
    selectFileDialogVisible,
    setSelectFileDialogVisible,
    hotkeyPanelVisible,
    invitePanelVisible,
    convertPasswordDialogVisible,
    createRoomDialogVisible,
    createRoomConfirmDialogVisible,
    confirmDialogIsLoading,
    restoreAllPanelVisible,
    archiveDialogVisible,
    inviteUsersWarningDialogVisible,
    preparationPortalDialogVisible,
    changeUserTypeDialogVisible,
    restoreRoomDialogVisible,
    statusFillingPanelVisible,
    deleteAllFormsDialogVisible,
    deleteFormDialogVisible,
  } = props;

  const { t } = useTranslation(["Translations", "Common"]);

  const onClose = () => {
    setSelectFileDialogVisible(false);
  };

  return [
    uploadPanelVisible && <UploadPanel key="upload-panel" />,
    sharingPanelVisible && (
      <SharingPanel
        key="sharing-panel"
        uploadPanelVisible={uploadPanelVisible}
      />
    ),
    ownerPanelVisible && <ChangeOwnerPanel key="change-owner-panel" />,
    (moveToPanelVisible || copyPanelVisible || restoreAllPanelVisible) && (
      <FilesSelector
        key="files-selector"
        isMove={moveToPanelVisible}
        isCopy={copyPanelVisible}
        isRestoreAll={restoreAllPanelVisible}
      />
    ),
    connectDialogVisible && <ConnectDialog key="connect-dialog" />,
    deleteThirdPartyDialogVisible && (
      <DeleteThirdPartyDialog key="thirdparty-delete-dialog" />
    ),
    versionHistoryPanelVisible && (
      <VersionHistoryPanel key="version-history-panel" />
    ),
    deleteDialogVisible && <DeleteDialog key="delete-dialog" />,
    emptyTrashDialogVisible && <EmptyTrashDialog key="empty-trash-dialog" />,
    downloadDialogVisible && <DownloadDialog key="download-dialog" />,

    newFilesPanelVisible && <NewFilesPanel key="new-files-panel" />,
    conflictResolveDialogVisible && (
      <ConflictResolveDialog key="conflict-resolve-dialog" />
    ),
    convertDialogVisible && <ConvertDialog key="convert-dialog" />,
    changeUserTypeDialogVisible && (
      <ChangeUserTypeDialog key="change-user-type-dialog" />
    ),
    createRoomDialogVisible && <CreateRoomDialog key="create-room-dialog" />,
    (createRoomConfirmDialogVisible || confirmDialogIsLoading) && (
      <CreateRoomConfirmDialog key="create-room-confirm-dialog" />
    ),
    selectFileDialogVisible && (
      <FilesSelector
        key="select-file-dialog"
        filterParam={FilesSelectorFilterTypes.DOCX}
        isPanelVisible={selectFileDialogVisible}
        onSelectFile={createMasterForm}
        onClose={onClose}
      />
    ),

    hotkeyPanelVisible && <HotkeyPanel key="hotkey-panel" />,
    invitePanelVisible && <InvitePanel key="invite-panel" />,
    convertPasswordDialogVisible && (
      <ConvertPasswordDialog key="convert-password-dialog" />
    ),
    archiveDialogVisible && <ArchiveDialog key="archive-dialog" />,
    restoreRoomDialogVisible && <RestoreRoomDialog key="archive-dialog" />,
    inviteUsersWarningDialogVisible && (
      <InviteUsersWarningDialog key="invite-users-warning-dialog" />
    ),
    preparationPortalDialogVisible && (
      <PreparationPortalDialog key="preparation-portal-dialog" />
    ),
    statusFillingPanelVisible && (
      <StatusFillingPanel key="status-filling-panel" />
    ),
    deleteAllFormsDialogVisible && (
      <DeleteAllFormsDialog key="delete-all-forms-dialog" />
    ),
    deleteFormDialogVisible && <DeleteFormDialog key="delete-form-dialog" />,
  ];
};

export default inject(
  ({
    auth,
    dialogsStore,
    uploadDataStore,
    versionHistoryStore,
    backup,
    createEditRoomStore,
  }) => {
    const {
      sharingPanelVisible,
      ownerPanelVisible,
      copyPanelVisible,
      moveToPanelVisible,
      thirdPartyMoveDialogVisible,
      connectDialogVisible,
      deleteThirdPartyDialogVisible,
      deleteDialogVisible,
      downloadDialogVisible,
      emptyTrashDialogVisible,
      newFilesPanelVisible,
      conflictResolveDialogVisible,
      convertDialogVisible,
      createRoomDialogVisible,
      createRoomConfirmDialogVisible,
      convertPasswordDialogVisible,
      connectItem, //TODO:
      restoreAllPanelVisible,
      archiveDialogVisible,
      restoreRoomDialogVisible,

      createMasterForm,
      selectFileDialogVisible,
      setSelectFileDialogVisible,
      invitePanelOptions,
      inviteUsersWarningDialogVisible,
      changeUserTypeDialogVisible,
      statusFillingPanelVisible,
      deleteAllFormsDialogVisible,
      deleteFormDialogVisible,
    } = dialogsStore;

    const { preparationPortalDialogVisible } = backup;

    const { uploadPanelVisible } = uploadDataStore;
    const { isVisible: versionHistoryPanelVisible } = versionHistoryStore;
    const { hotkeyPanelVisible } = auth.settingsStore;
    const { confirmDialogIsLoading } = createEditRoomStore;

    return {
      preparationPortalDialogVisible,
      sharingPanelVisible,
      uploadPanelVisible,
      ownerPanelVisible,
      copyPanelVisible,
      moveToPanelVisible,
      thirdPartyMoveDialogVisible,
      connectDialogVisible: connectDialogVisible || !!connectItem, //TODO:
      deleteThirdPartyDialogVisible,
      versionHistoryPanelVisible,
      deleteDialogVisible,
      downloadDialogVisible,
      emptyTrashDialogVisible,
      newFilesPanelVisible,
      conflictResolveDialogVisible,
      convertDialogVisible,
      createRoomDialogVisible,
      createRoomConfirmDialogVisible,
      convertPasswordDialogVisible,
      selectFileDialogVisible,
      createMasterForm,
      setSelectFileDialogVisible,
      hotkeyPanelVisible,
      restoreAllPanelVisible,
      invitePanelVisible: invitePanelOptions.visible,
      archiveDialogVisible,
      inviteUsersWarningDialogVisible,
      confirmDialogIsLoading,
      changeUserTypeDialogVisible,
      restoreRoomDialogVisible,
      statusFillingPanelVisible,
      deleteAllFormsDialogVisible,
      deleteFormDialogVisible,
    };
  }
)(observer(Panels));

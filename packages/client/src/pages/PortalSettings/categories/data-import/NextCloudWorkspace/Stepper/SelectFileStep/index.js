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

import { useState, useRef, useEffect } from "react";
import { inject, observer } from "mobx-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CancelUploadDialog } from "SRC_DIR/components/dialogs";
import { isTablet } from "@docspace/shared/utils/device";
import styled from "styled-components";

import { Text } from "@docspace/shared/components/text";
import { Button } from "@docspace/shared/components/button";
import { FileInput } from "@docspace/shared/components/file-input";
import { ProgressBar } from "@docspace/shared/components/progress-bar";
import { SaveCancelButtons } from "@docspace/shared/components/save-cancel-buttons";
import { Box } from "@docspace/shared/components/box";
import { Link } from "@docspace/shared/components/link";
import { toastr } from "@docspace/shared/components/toast";

const Wrapper = styled.div`
  max-width: 700px;
  margin-top: 16px;

  .choose-backup-file {
    font-weight: 600;
    line-height: 20px;
    margin-bottom: 4px;
  }

  .upload-backup-input {
    height: 32px;
    margin-bottom: 12px;

    .icon-button_svg {
      svg {
        path {
          fill: ${(props) =>
            props.theme.client.settings.migration.fileInputIconColor};
        }
      }
    }
  }

  .upload-back-buttons {
    margin-top: 16px;
  }

  .select-file-progress-text {
    margin: 12px 0;
  }

  .select-file-progress-bar {
    margin: 12px 0 16px;
  }
`;

const FileUploadContainer = styled.div`
  max-width: 350px;
`;

const ErrorBlock = styled.div`
  max-width: 700px;

  .complete-progress-bar {
    margin: 12px 0 16px;
    max-width: 350px;
  }

  .error-text {
    font-size: 12px;
    margin-bottom: 10px;
    color: ${(props) => props.theme.client.settings.migration.errorTextColor};
  }

  .save-cancel-buttons {
    margin-top: 16px;
  }
`;

const FAILS_TRIES = 1;

const SelectFileStep = ({
  t,
  incrementStep,
  cancelDialogVisible,
  setCancelDialogVisibile,
  initMigrationName,
  singleFileUploading,
  getMigrationStatus,
  setUsers,
  isFileLoading,
  setIsFileLoading,
  cancelMigration,
}) => {
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFileError, setIsFileError] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [searchParams] = useSearchParams();
  const isAbort = useRef(false);
  const uploadInterval = useRef(null);
  const navigate = useNavigate();

  const [failTries, setFailsTries] = useState(FAILS_TRIES);

  const goBack = () => {
    navigate("/portal-settings/data-import/migration");
  };

  const checkMigrationStatusAndUpdate = async () => {
    try {
      const res = await getMigrationStatus();

      if (!res || res.parseResult.migratorName !== "Nextcloud") {
        clearInterval(uploadInterval.current);
        return;
      }

      if (res.parseResult.operation === "parse" && !res.isCompleted) {
        setProgress(res.progress);
        setIsFileLoading(true);
      } else {
        setIsFileLoading(false);
      }

      setIsFileError(false);
      setIsSaveDisabled(false);

      if (res.parseResult.files?.length > 0) {
        setFileName(res.parseResult.files.join(", "));
      }

      if (!res || res.parseResult.failedArchives.length > 0 || res.error) {
        toastr.error(res.error);
        setIsFileError(true);
        setIsSaveDisabled(false);
        clearInterval(uploadInterval.current);
      } else if (res.isCompleted || res.progress === 100) {
        setUsers(res.parseResult);
        setIsSaveDisabled(true);
        incrementStep && incrementStep();
        clearInterval(uploadInterval.current);
      }
    } catch (error) {
      toastr.error(error.message);
      setIsFileError(true);
      clearInterval(uploadInterval.current);
    }
  };

  useEffect(() => {
    setIsSaveDisabled(false);
    checkMigrationStatusAndUpdate();

    uploadInterval.current = setInterval(() => {
      checkMigrationStatusAndUpdate();
    }, 1000);

    return () => clearInterval(uploadInterval.current);
  }, []);

  const onUploadToServer = () => {
    setIsSaveDisabled(false);
    checkMigrationStatusAndUpdate();
  };

  const onUploadFile = async (file) => {
    setIsVisible(true);
    try {
      if (Array.isArray(file)) throw new Error(t("Common:SomethingWentWrong"));

      await singleFileUploading(file, setProgress, isAbort);

      if (isAbort.current) return;

      await initMigrationName(searchParams.get("service"));

      uploadInterval.current = setInterval(async () => {
        try {
          const res = await getMigrationStatus();

          if (!res && failTries) {
            setFailsTries((tries) => tries - 1);
            return;
          }

          if (!res || res.parseResult.failedArchives.length > 0 || res.error) {
            clearInterval(uploadInterval.current);
            setIsFileError(true);
            setIsFileLoading(false);
            toastr.error(res.error);
            return;
          }

          if (res.isCompleted || res.parseResult.progress === 100) {
            clearInterval(uploadInterval.current);
            setIsFileLoading(false);
            setIsVisible(false);
            setUsers(res.parseResult);
            setIsSaveDisabled(true);
          }

          setProgress(res.progress);

          if (res.progress > 10) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
        } catch (error) {
          toastr.error(error || error.message);
          setIsFileError(true);
          setIsFileLoading(false);
          setIsError(true);
          clearInterval(uploadInterval.current);
        } finally {
          isAbort.current = false;
        }
      }, 1000);
    } catch (error) {
      toastr.error(error || error.message);
      setIsFileError(true);
      setIsFileLoading(false);
    }
  };

  const onSelectFile = (file) => {
    setProgress(0);
    setIsFileError(false);
    setIsSaveDisabled(false);
    setIsFileLoading(true);
    setFailsTries(FAILS_TRIES);
    try {
      onUploadFile(file);
    } catch (error) {
      toastr.error(error);
      setIsFileLoading(false);
    }
  };

  const onDownloadArchives = async () => {
    try {
      await getMigrationStatus()
        .then(
          (res) =>
            new Blob([res.parseResult.failedArchives], {
              type: "text/csv;charset=utf-8",
            }),
        )
        .then((blob) => {
          let a = document.createElement("a");
          const url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = "unsupported_files";
          a.click();
          window.URL.revokeObjectURL(url);
        });
    } catch (error) {
      toastr.error(error);
    }
  };

  const onCancel = () => {
    setCancelDialogVisibile(true);
  };

  const handleCancelMigration = () => {
    isAbort.current = true;
    setProgress(0);
    setIsFileLoading(false);
    clearInterval(uploadInterval.current);
    cancelMigration();
  };

  const hideCancelDialog = () => setCancelDialogVisibile(false);

  return (
    <Wrapper>
      <FileUploadContainer>
        <Text className="choose-backup-file">
          {t("Settings:ChooseBackupFile")}
        </Text>
        <FileInput
          scale
          onInput={onSelectFile}
          className="upload-backup-input"
          placeholder={fileName || t("Settings:BackupFile")}
          isDisabled={isFileLoading}
          accept={[".zip"]}
          isMultiple={false}
        />
      </FileUploadContainer>
      {isFileLoading ? (
        <FileUploadContainer>
          <ProgressBar
            percent={progress}
            isInfiniteProgress={isVisible}
            className="select-file-progress-bar"
            label={t("Settings:BackupFileUploading")}
          />
          <Button
            size={isTablet() ? "medium" : "small"}
            label={t("Common:CancelButton")}
            onClick={onCancel}
          />
        </FileUploadContainer>
      ) : (
        <ErrorBlock>
          {isFileError && (
            <Box>
              <ProgressBar
                percent={100}
                className="complete-progress-bar"
                label={t("Common:LoadingIsComplete")}
              />
              <Text className="error-text">
                {t("Settings:UnsupportedFilesDescription")}
              </Text>
              <Link
                type="action"
                isHovered
                fontWeight={600}
                onClick={onDownloadArchives}
              >
                {t("Settings:CheckUnsupportedFiles")}
              </Link>
            </Box>
          )}

          {isError ? (
            <SaveCancelButtons
              className="save-cancel-buttons"
              onSaveClick={onUploadToServer}
              onCancelClick={goBack}
              saveButtonLabel={t("Settings:UploadToServer")}
              cancelButtonLabel={t("Common:Back")}
              isSaving={isSaveDisabled}
              displaySettings
              saveButtonDisabled={isSaveDisabled}
              showReminder
            />
          ) : (
            <SaveCancelButtons
              className="save-cancel-buttons"
              onSaveClick={incrementStep}
              onCancelClick={goBack}
              saveButtonLabel={t("Settings:NextStep")}
              cancelButtonLabel={t("Common:Back")}
              displaySettings
              saveButtonDisabled={!isSaveDisabled}
              showReminder
            />
          )}
        </ErrorBlock>
      )}

      {cancelDialogVisible && (
        <CancelUploadDialog
          visible={cancelDialogVisible}
          // loading={isFileLoading}
          onClose={hideCancelDialog}
          cancelMigration={handleCancelMigration}
        />
      )}
    </Wrapper>
  );
};

export default inject(({ dialogsStore, importAccountsStore }) => {
  const {
    initMigrationName,
    singleFileUploading,
    getMigrationStatus,
    setUsers,
    isFileLoading,
    setIsFileLoading,
    cancelMigration,
  } = importAccountsStore;
  const { cancelUploadDialogVisible, setCancelUploadDialogVisible } =
    dialogsStore;

  return {
    initMigrationName,
    singleFileUploading,
    getMigrationStatus,
    setUsers,
    isFileLoading,
    setIsFileLoading,
    cancelMigration,
    cancelDialogVisible: cancelUploadDialogVisible,
    setCancelDialogVisibile: setCancelUploadDialogVisible,
  };
})(observer(SelectFileStep));

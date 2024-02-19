"use client";

import React from "react";
import { I18nextProvider } from "react-i18next";
import { toast } from "react-toastify";

import { Toast } from "@docspace/shared/components/toast";
import { TFile } from "@docspace/shared/api/files/types";
import { ThemeProvider } from "@docspace/shared/components/theme-provider";
import ErrorBoundary from "@docspace/shared/components/error-boundary/ErrorBoundary";
import ErrorContainer from "@docspace/shared/components/error-container/ErrorContainer";
import FirebaseHelper from "@docspace/shared/utils/firebase";
import { TFirebaseSettings } from "@docspace/shared/api/settings/types";
import { TUser } from "@docspace/shared/api/people/types";

import { TResponse } from "@/types";
import useError from "@/hooks/useError";
import useI18N from "@/hooks/useI18N";
import useTheme from "@/hooks/useTheme";
import useDeviceType from "@/hooks/useDeviceType";
import useWhiteLabel from "@/hooks/useWhiteLabel";
import useRootInit from "@/hooks/useRootInit";
import useDeepLink from "@/hooks/useDeepLink";
import useSelectFileDialog from "@/hooks/useSelectFileDialog";
import useSelectFolderDialog from "@/hooks/useSelectFolderDialog";
import useSocketHelper from "@/hooks/useSocketHelper";

import pkgFile from "../../package.json";

import DeepLink from "./deep-link";

import SelectFileDialog from "./SelectFileDialog";
import SelectFolderDialog from "./SelectFolderDialog";
import Editor from "./Editor";
import { IS_VIEW } from "@/utils/constants";

toast.configure();

const Root = ({
  settings,
  config,
  successAuth,
  user,
  error,
  isSharingAccess,
  editorUrl,
  doc,
}: TResponse) => {
  const documentserverUrl = editorUrl?.docServiceUrl;
  const fileInfo = config?.file;
  const firebaseHelper = new FirebaseHelper(
    settings?.firebase ?? ({} as TFirebaseSettings),
  );
  const instanceId = config?.document?.referenceData.instanceId;

  useRootInit({
    documentType: config?.documentType,
    fileType: config?.file.fileType,
  });
  const { i18n } = useI18N({ settings, user });

  const t = i18n.t ? i18n.t.bind(i18n) : null;
  const { onError, getErrorMessage } = useError({
    error,
    editorUrl: documentserverUrl,
    t,
  });
  const { theme, currentColorTheme } = useTheme({ user });
  const { currentDeviceType } = useDeviceType();
  const { logoUrls } = useWhiteLabel();
  const { isShowDeepLink, setIsShowDeepLink } = useDeepLink({
    settings,
    fileInfo,
    email: user?.email,
  });

  const { socketHelper } = useSocketHelper({
    socketUrl: settings?.socketUrl ?? "",
  });
  const {
    onSDKRequestSaveAs,
    onCloseSelectFolderDialog,
    onSubmitSelectFolderDialog,
    getIsDisabledSelectFolderDialog,
    isVisibleSelectFolderDialog,
    titleSelectorFolderDialog,
  } = useSelectFolderDialog({});
  const {
    onSDKRequestInsertImage,
    onSDKRequestReferenceSource,
    onSDKRequestSelectDocument,
    onSDKRequestSelectSpreadsheet,
    onCloseSelectFileDialog,
    onSubmitSelectFileDialog,
    getIsDisabledSelectFileDialog,

    selectFileDialogFileTypeDetection,

    selectFileDialogVisible,
  } = useSelectFileDialog({ instanceId: instanceId ?? "" });

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme} currentColorScheme={currentColorTheme}>
        <ErrorBoundary
          user={user ?? ({} as TUser)}
          version={pkgFile.version}
          firebaseHelper={firebaseHelper}
          currentDeviceType={currentDeviceType}
          whiteLabelLogoUrls={logoUrls}
          isNextJS
          theme={theme}
          i18n={i18n}
          onError={onError}
        >
          {isShowDeepLink ? (
            <DeepLink
              fileInfo={fileInfo}
              logoUrls={logoUrls}
              userEmail={user?.email}
              theme={theme}
              currentDeviceType={currentDeviceType}
              deepLinkConfig={settings?.deepLink}
              setIsShowDeepLink={setIsShowDeepLink}
            />
          ) : error && error.message !== "unauthorized" ? (
            <ErrorContainer
              headerText={t?.("Common:Error")}
              customizedBodyText={getErrorMessage()}
              isEditor
            />
          ) : (
            <>
              {config && user && documentserverUrl && fileInfo && (
                <Editor
                  config={config}
                  user={user}
                  view={IS_VIEW}
                  successAuth={successAuth}
                  doc={doc}
                  t={t}
                  documentserverUrl={documentserverUrl}
                  fileInfo={fileInfo}
                  onSDKRequestSaveAs={onSDKRequestSaveAs}
                  onSDKRequestInsertImage={onSDKRequestInsertImage}
                  onSDKRequestReferenceSource={onSDKRequestReferenceSource}
                  onSDKRequestSelectDocument={onSDKRequestSelectDocument}
                  onSDKRequestSelectSpreadsheet={onSDKRequestSelectSpreadsheet}
                />
              )}
              <Toast />
              {isVisibleSelectFolderDialog && !!socketHelper && (
                <SelectFolderDialog
                  socketHelper={socketHelper}
                  isVisible={isVisibleSelectFolderDialog}
                  onSubmit={onSubmitSelectFolderDialog}
                  onClose={onCloseSelectFolderDialog}
                  titleSelectorFolder={titleSelectorFolderDialog}
                  fileInfo={fileInfo ?? ({} as TFile)}
                  getIsDisabled={getIsDisabledSelectFolderDialog}
                  t={t}
                  i18n={i18n}
                />
              )}
              {selectFileDialogVisible && !!socketHelper && (
                <SelectFileDialog
                  socketHelper={socketHelper}
                  isVisible={selectFileDialogVisible}
                  onSubmit={onSubmitSelectFileDialog}
                  onClose={onCloseSelectFileDialog}
                  getIsDisabled={getIsDisabledSelectFileDialog}
                  fileTypeDetection={selectFileDialogFileTypeDetection}
                  fileInfo={fileInfo ?? ({} as TFile)}
                  t={t}
                  i18n={i18n}
                />
              )}
            </>
          )}
        </ErrorBoundary>
      </ThemeProvider>
    </I18nextProvider>
  );
};

export default Root;

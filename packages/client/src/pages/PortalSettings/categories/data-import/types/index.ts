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

import { useTranslation } from "react-i18next";
import { TWorkspaceService } from "@docspace/shared/api/settings/types";

export type TFunciton = ReturnType<typeof useTranslation>["t"];

export interface ProvidersProps {}

export interface InjectedProvidersProps extends ProvidersProps {
  theme: TStore["settingsStore"]["theme"];
  services: TStore["importAccountsStore"]["services"];
  setServices: TStore["importAccountsStore"]["setServices"];
  getMigrationList: TStore["importAccountsStore"]["getMigrationList"];
  getMigrationStatus: TStore["importAccountsStore"]["getMigrationStatus"];
  setDocumentTitle: TStore["authStore"]["setDocumentTitle"];
  isMigrationInit: TStore["importAccountsStore"]["isMigrationInit"];
  setIsMigrationInit: TStore["importAccountsStore"]["setIsMigrationInit"];
  setWorkspace: TStore["importAccountsStore"]["setWorkspace"];
}

export interface SelectFileStepProps {
  t: TFunciton;
  isMultipleUpload?: boolean;
  acceptedExtensions: string[];
  migratorName: TWorkspaceService;
}

export interface InjectedSelectFileStepProps extends SelectFileStepProps {
  t: TFunciton;
  incrementStep: TStore["importAccountsStore"]["incrementStep"];
  setWorkspace: TStore["importAccountsStore"]["setWorkspace"];
  cancelUploadDialogVisible: TStore["dialogsStore"]["cancelUploadDialogVisible"];
  setCancelUploadDialogVisible: TStore["dialogsStore"]["setCancelUploadDialogVisible"];
  initMigrationName: TStore["importAccountsStore"]["initMigrationName"];
  singleFileUploading: TStore["importAccountsStore"]["singleFileUploading"];
  getMigrationStatus: TStore["importAccountsStore"]["getMigrationStatus"];
  setUsers: TStore["importAccountsStore"]["setUsers"];
  fileLoadingStatus: TStore["importAccountsStore"]["fileLoadingStatus"];
  setLoadingStatus: TStore["importAccountsStore"]["setLoadingStatus"];
  cancelMigration: TStore["importAccountsStore"]["cancelMigration"];
  files: TStore["importAccountsStore"]["files"];
  setFiles: TStore["importAccountsStore"]["setFiles"];
  multipleFileUploading: TStore["importAccountsStore"]["multipleFileUploading"];
}

export interface DataImportProps {}

export interface InjectedDataImportProps extends DataImportProps {
  setDocumentTitle: TStore["authStore"]["setDocumentTitle"];
  getMigrationStatus: TStore["importAccountsStore"]["getMigrationStatus"];
  viewAs: TStore["setup"]["viewAs"];
  setViewAs: TStore["setup"]["setViewAs"];
  currentDeviceType: TStore["settingsStore"]["currentDeviceType"];
  isMigrationInit: TStore["importAccountsStore"]["isMigrationInit"];
  setUsers: TStore["importAccountsStore"]["setUsers"];
  workspace: TStore["importAccountsStore"]["workspace"];
  setWorkspace: TStore["importAccountsStore"]["setWorkspace"];
  setFiles: TStore["importAccountsStore"]["setFiles"];
  setIsMigrationInit: TStore["importAccountsStore"]["setIsMigrationInit"];
  setLoadingStatus: TStore["importAccountsStore"]["setLoadingStatus"];
}

export interface WorkspaceProps {}

export interface InjectedWorkspaceProps extends WorkspaceProps {
  theme: TStore["settingsStore"]["theme"];
  filteredUsers: TStore["importAccountsStore"]["filteredUsers"];
  step: TStore["importAccountsStore"]["step"];
  incrementStep: TStore["importAccountsStore"]["incrementStep"];
  decrementStep: TStore["importAccountsStore"]["decrementStep"];
}

export interface LayoutProps {
  t: TFunciton;
  theme: TStore["settingsStore"]["theme"];
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  component: JSX.Element;
}

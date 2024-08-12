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

import { match, P } from "ts-pattern";

import InviteUserFormIcon from "PUBLIC_DIR/images/emptyview/invite.user.svg";
import UploadPDFFormIcon from "PUBLIC_DIR/images/emptyview/upload.pdf.form.svg";
import UploadDevicePDFFormIcon from "PUBLIC_DIR/images/emptyview/upload.device.pdf.form.svg";
import CreateNewFormIcon from "PUBLIC_DIR/images/emptyview/create.new.form.svg";

import EmptyRoomsRootDarkIcon from "PUBLIC_DIR/images/emptyview/empty.rooms.root.dark.svg";
import EmptyRoomsRootLightIcon from "PUBLIC_DIR/images/emptyview/empty.rooms.root.light.svg";

import EmptyRecentDarkIcon from "PUBLIC_DIR/images/emptyview/empty.recent.dark.svg";
import EmptyRecentLightIcon from "PUBLIC_DIR/images/emptyview/empty.recent.light.svg";

import EmptyRoomsRootUserDarkIcon from "PUBLIC_DIR/images/emptyview/empty.rooms.root.user.dark.svg";
import EmptyRoomsRootUserLightIcon from "PUBLIC_DIR/images/emptyview/empty.rooms.root.user.light.svg";

import EmptyFormRoomDarkIcon from "PUBLIC_DIR/images/emptyview/empty.form.room.dark.svg";
import EmptyFormRoomLightIcon from "PUBLIC_DIR/images/emptyview/empty.form.room.light.svg";

import EmptyFormRoomCollaboratorDarkIcon from "PUBLIC_DIR/images/emptyview/empty.form.room.collaborator.dark.svg";
import EmptyFormRoomCollaboratorLightIcon from "PUBLIC_DIR/images/emptyview/empty.form.room.collaborator.light.svg";

import EmptyFormRoomFillingDarkIcon from "PUBLIC_DIR/images/emptyview/empty.form.room.filling.dark.svg";
import EmptyFormRoomFillingLightIcon from "PUBLIC_DIR/images/emptyview/empty.form.room.filling.light.svg";

import EmptyCustomRoomDarkIcon from "PUBLIC_DIR/images/emptyview/empty.custom.room.dark.svg";
import EmptyCustomRoomLightIcon from "PUBLIC_DIR/images/emptyview/empty.custom.room.light.svg";

import EmptyCustomRoomCollaboratorDarkIcon from "PUBLIC_DIR/images/emptyview/empty.custom.room.collaborator.dark.svg";
import EmptyCustomRoomCollaboratorLightIcon from "PUBLIC_DIR/images/emptyview/empty.custom.room.collaborator.light.svg";

import EmptyPublicRoomDarkIcon from "PUBLIC_DIR/images/emptyview/empty.public.room.dark.svg";
import EmptyPublicRoomLightIcon from "PUBLIC_DIR/images/emptyview/empty.public.room.light.svg";

import EmptyPublicRoomCollaboratorDarkIcon from "PUBLIC_DIR/images/emptyview/empty.public.room.collaborator.dark.svg";
import EmptyPublicRoomCollaboratorLightIcon from "PUBLIC_DIR/images/emptyview/empty.public.room.collaborator.light.svg";

import EmptyCollaborationRoomDarkIcon from "PUBLIC_DIR/images/emptyview/empty.collaboration.room.dark.svg";
import EmptyCollaborationRoomLightIcon from "PUBLIC_DIR/images/emptyview/empty.collaboration.room.light.svg";
import EmptyCollaborationRoomCollaboratorDarkIcon from "PUBLIC_DIR/images/emptyview/empty.collaboration.room.collaborator.dark.svg";
import EmptyCollaborationRoomCollaboratorLightIcon from "PUBLIC_DIR/images/emptyview/empty.collaboration.room.collaborator.light.svg";

import FormDefaultFolderLight from "PUBLIC_DIR/images/emptyview/empty.form.default.folder.light.svg";
import FormDefaultFolderDark from "PUBLIC_DIR/images/emptyview/empty.form.default.folder.dark.svg";
import DefaultFolderDark from "PUBLIC_DIR/images/emptyview/empty.default.folder.dark.svg";
import DefaultFolderLight from "PUBLIC_DIR/images/emptyview/empty.default.folder.light.svg";
import DefaultFolderUserDark from "PUBLIC_DIR/images/emptyview/empty.default.folder.user.dark.svg";
import DefaultFolderUserLight from "PUBLIC_DIR/images/emptyview/empty.default.folder.user.light.svg";

import {
  FilesSelectorFilterTypes,
  FilterType,
  FolderType,
  RoomsType,
  ShareAccessRights,
} from "@docspace/shared/enums";

import type { Nullable, TTranslation } from "@docspace/shared/types";
import type { TFolderSecurity } from "@docspace/shared/api/files/types";
import type { TRoomSecurity } from "@docspace/shared/api/rooms/types";

import { DefaultFolderType } from "./EmptyViewContainer.constants";
import type {
  AccessType,
  ExtensiontionType,
  OptionActions,
  UploadType,
} from "./EmptyViewContainer.types";

export const isUser = (access: AccessType) => {
  return (
    access !== ShareAccessRights.None &&
    access !== ShareAccessRights.RoomManager &&
    access !== ShareAccessRights.Collaborator
  );
};

export const isAdmin = (access: AccessType) => {
  return !isUser(access);
};

export const getFolderDescription = (
  t: TTranslation,
  access: AccessType,
  isNotAdmin: boolean,
  isArchiveFolderRoot: boolean,
  folderType: Nullable<FolderType>,
  parentRoomType: Nullable<FolderType>,
) => {
  return match([parentRoomType, folderType, access])
    .with([P._, FolderType.Done, P._], () =>
      t("Files:EmptyFormFolderDoneDescriptionText"),
    )
    .with([P._, FolderType.InProgress, P._], () =>
      t("Files:EmptyFormFolderProgressDescriptionText"),
    )
    .with([P._, FolderType.SubFolderDone, P._], () =>
      t("Files:EmptyFormSubFolderDoneDescriptionText"),
    )
    .with([P._, FolderType.SubFolderInProgress, P._], () =>
      t("Files:EmptyFormSubFolderProgressDescriptionText"),
    )
    .with(
      [
        FolderType.FormRoom,
        null,
        P.when(() => isNotAdmin || isArchiveFolderRoot),
      ],
      () => t("EmptyView:FormFolderDefaultUserDescription"),
    )
    .with([FolderType.FormRoom, DefaultFolderType, P._], () =>
      t("EmptyView:FormFolderDefaultDescription", {
        productName: t("Common:ProductName"),
      }),
    )
    .with([P._, DefaultFolderType, P.when(isAdmin)], () =>
      t("EmptyView:DefaultFolderDescription"),
    )
    .with([P._, DefaultFolderType, P.when(isUser)], () =>
      t("EmptyView:UserEmptyDescription"),
    )
    .otherwise(() => "");
};

export const getRoomDescription = (
  t: TTranslation,
  isNotAdmin: boolean,
  isArchiveFolderRoot: boolean,
) => {
  if (isNotAdmin || isArchiveFolderRoot)
    return t("EmptyView:UserEmptyDescription");

  return t("EmptyView:EmptyDescription");
};

export const getRootDesctiption = (
  t: TTranslation,
  access: AccessType,
  rootFolderType: Nullable<FolderType>,
) => {
  return match([rootFolderType, access])
    .with([FolderType.Rooms, ShareAccessRights.None], () =>
      t("Files:RoomEmptyContainerDescription"),
    )
    .with([FolderType.Rooms, ShareAccessRights.DenyAccess], () =>
      t("EmptyView:EmptyRootRoomUserDescription"),
    )
    .with([FolderType.USER, ShareAccessRights.None], () =>
      t("EmptyView:DefaultFolderDescription"),
    )
    .with([FolderType.Recent, P._], () => t("EmptyView:EmptyRecentDescription"))
    .with([FolderType.Archive, P._], () => t("Test"))
    .with([FolderType.TRASH, P._], () => t("Test"))
    .otherwise(() => "");
};

export const getFolderTitle = (
  t: TTranslation,
  isArchiveFolderRoot: boolean,
  isNotAdmin: boolean,
  access: AccessType,
  folderType: Nullable<FolderType>,
  parentRoomType: Nullable<FolderType>,
) => {
  return match([parentRoomType, folderType, access])
    .with([P._, FolderType.Done, P._], () =>
      t("Files:EmptyFormFolderDoneHeaderText"),
    )

    .with([P._, FolderType.InProgress, P._], () =>
      t("Files:EmptyFormFolderProgressHeaderText"),
    )
    .with(
      [
        P._,
        P.union(FolderType.SubFolderDone, FolderType.SubFolderInProgress),
        P._,
      ],
      () => t("Files:EmptyFormSubFolderHeaderText"),
    )
    .with(
      [
        FolderType.FormRoom,
        DefaultFolderType,
        P.when(() => isNotAdmin || isArchiveFolderRoot),
      ],
      () => t("EmptyView:FormFolderDefaultUserTitle"),
    )
    .with([FolderType.FormRoom, DefaultFolderType, P._], () =>
      t("EmptyView:FormFolderDefaultTitle"),
    )
    .with([P._, DefaultFolderType, P._], () => t("Files:EmptyScreenFolder"))
    .otherwise(() => "");
};

export const getRoomTitle = (
  t: TTranslation,
  type: RoomsType,
  access: AccessType,
  isNotAdmin: boolean,
  isArchiveFolderRoot: boolean,
) => {
  const isCollaborator = access === ShareAccessRights.Collaborator;

  if (isCollaborator) return t("EmptyView:CollaboratorEmptyTitle");

  if (isNotAdmin || isArchiveFolderRoot) return t("Files:EmptyScreenFolder");

  switch (type) {
    case RoomsType.FormRoom:
      return t("EmptyView:FormRoomEmptyTitle");
    case RoomsType.EditingRoom:
      return t("EmptyView:CollaborationRoomEmptyTitle");
    case RoomsType.PublicRoom:
      return t("EmptyView:PublicRoomEmptyTitle");
    case RoomsType.CustomRoom:
      return t("EmptyView:CustomRoomEmptyTitle");
    default:
      return "";
  }
};

export const getRootTitle = (
  t: TTranslation,
  access: AccessType,
  rootFolderType: Nullable<FolderType>,
) => {
  console.log({ access, rootFolderType });

  return match([rootFolderType, access])
    .with([FolderType.Rooms, ShareAccessRights.None], () =>
      t("Files:EmptyRootRoomHeader", {
        productName: t("Common:ProductName"),
      }),
    )
    .with([FolderType.Rooms, ShareAccessRights.DenyAccess], () =>
      t("EmptyView:EmptyRootRoomUserTitle"),
    )
    .with([FolderType.USER, ShareAccessRights.None], () =>
      t("Files:EmptyScreenFolder"),
    )
    .with([FolderType.Recent, P._], () => t("Files:NoFilesHereYet"))
    .with([FolderType.Archive, P._], () => t("Test"))
    .with([FolderType.TRASH, P._], () => t("Test"))
    .otherwise(() => "");
};

export const getFolderIcon = (
  roomType: Nullable<FolderType>,
  isBaseTheme: boolean,
  access: AccessType,
  folderType: Nullable<FolderType>,
) => {
  return match([roomType, folderType, access])
    .with([FolderType.FormRoom, P._, P._], () =>
      isBaseTheme ? <FormDefaultFolderLight /> : <FormDefaultFolderDark />,
    )
    .with([P._, DefaultFolderType, P.when(isUser)], () =>
      isBaseTheme ? <DefaultFolderUserLight /> : <DefaultFolderUserDark />,
    )
    .with([P._, DefaultFolderType, P.when(isAdmin)], () =>
      isBaseTheme ? <DefaultFolderLight /> : <DefaultFolderDark />,
    )
    .otherwise(() => <div />);
};

export const getRoomIcon = (
  type: RoomsType,
  isBaseTheme: boolean,
  access: AccessType,
) => {
  return (
    match([type, access])
      .with([RoomsType.FormRoom, ShareAccessRights.FormFilling], () =>
        isBaseTheme ? (
          <EmptyFormRoomFillingLightIcon />
        ) : (
          <EmptyFormRoomFillingDarkIcon />
        ),
      )
      .with([RoomsType.FormRoom, ShareAccessRights.Collaborator], () =>
        isBaseTheme ? (
          <EmptyFormRoomCollaboratorLightIcon />
        ) : (
          <EmptyFormRoomCollaboratorDarkIcon />
        ),
      )
      .with([RoomsType.FormRoom, P._], () =>
        isBaseTheme ? <EmptyFormRoomLightIcon /> : <EmptyFormRoomDarkIcon />,
      )
      .with(
        [
          RoomsType.EditingRoom,
          P.union(ShareAccessRights.None, ShareAccessRights.RoomManager),
        ],
        () =>
          isBaseTheme ? (
            <EmptyCollaborationRoomLightIcon />
          ) : (
            <EmptyCollaborationRoomDarkIcon />
          ),
      )
      .with([RoomsType.EditingRoom, ShareAccessRights.Collaborator], () =>
        isBaseTheme ? (
          <EmptyCollaborationRoomCollaboratorLightIcon />
        ) : (
          <EmptyCollaborationRoomCollaboratorDarkIcon />
        ),
      )
      .with(
        [
          RoomsType.PublicRoom,
          P.union(ShareAccessRights.None, ShareAccessRights.RoomManager), // owner, docspace admin, room admin
        ],
        () =>
          isBaseTheme ? (
            <EmptyPublicRoomLightIcon />
          ) : (
            <EmptyPublicRoomDarkIcon />
          ),
      )
      .with([RoomsType.PublicRoom, ShareAccessRights.Collaborator], () =>
        isBaseTheme ? (
          <EmptyPublicRoomCollaboratorLightIcon />
        ) : (
          <EmptyPublicRoomCollaboratorDarkIcon />
        ),
      )
      .with(
        [
          RoomsType.CustomRoom,
          P.union(ShareAccessRights.None, ShareAccessRights.RoomManager), // owner, docspace admin, room admin
        ],
        () =>
          isBaseTheme ? (
            <EmptyCustomRoomLightIcon />
          ) : (
            <EmptyCustomRoomDarkIcon />
          ),
      )
      .with([RoomsType.CustomRoom, ShareAccessRights.Collaborator], () =>
        isBaseTheme ? (
          <EmptyCustomRoomCollaboratorLightIcon />
        ) : (
          <EmptyCustomRoomCollaboratorDarkIcon />
        ),
      )
      .with([P._, P.when(isUser)], () =>
        isBaseTheme ? <DefaultFolderUserLight /> : <DefaultFolderUserDark />,
      )
      // eslint-disable-next-line react/jsx-no-useless-fragment
      .otherwise(() => <></>)
  );
};

export const getRootIcom = (
  rootFolderType: Nullable<FolderType>,
  access: AccessType,
  isBaseTheme: boolean,
) => {
  return match([rootFolderType, access])
    .with([FolderType.Rooms, ShareAccessRights.None], () =>
      isBaseTheme ? <EmptyRoomsRootLightIcon /> : <EmptyRoomsRootDarkIcon />,
    )
    .with([FolderType.Rooms, ShareAccessRights.DenyAccess], () =>
      isBaseTheme ? (
        <EmptyRoomsRootUserLightIcon />
      ) : (
        <EmptyRoomsRootUserDarkIcon />
      ),
    )
    .with([FolderType.USER, ShareAccessRights.None], () =>
      isBaseTheme ? <DefaultFolderLight /> : <DefaultFolderDark />,
    )
    .with([FolderType.Recent, P._], () =>
      isBaseTheme ? <EmptyRecentLightIcon /> : <EmptyRecentDarkIcon />,
    )
    .with([FolderType.Archive, P._], () => <div />)
    .with([FolderType.TRASH, P._], () => <div />)
    .otherwise(() => <div />);
};

export const helperOptions = (
  actions: OptionActions,
  security: Nullable<TFolderSecurity | TRoomSecurity>,
) => {
  const createInviteOption = (title: string, description: string) => {
    return {
      title,
      description,
      icon: <InviteUserFormIcon />,
      key: "invite-users",
      onClick: actions.inviteUser,
      disabled: !security?.EditAccess,
    };
  };

  const createCreateFileOption = (
    title: string,
    description: string,
    extension: ExtensiontionType,
    withoutDialog: boolean = false,
  ) => ({
    title,
    description,
    icon: <CreateNewFormIcon />,
    key: "create-form",
    onClick: () => actions.onCreate(extension, withoutDialog),
    disabled: !security?.Create,
  });

  const createUploadFromDeviceOption = (
    title: string,
    description: string,
    uploadType: UploadType,
  ) => ({
    title,
    description,
    icon: <UploadDevicePDFFormIcon />,
    key: "create-form",
    onClick: () => actions.onUploadAction(uploadType),
    disabled: !security?.Create,
  });

  const createUploadFromDocSpace = (
    title: string,
    description: string,
    filterType: FilesSelectorFilterTypes | FilterType,
  ) => ({
    title,
    description,
    icon: <UploadPDFFormIcon />,
    key: "upload-pdf-form",
    onClick: () => actions.uploadFromDocspace(filterType),
    disabled: !security?.Create,
  });

  return {
    createInviteOption,
    createCreateFileOption,
    createUploadFromDocSpace,
    createUploadFromDeviceOption,
  };
};

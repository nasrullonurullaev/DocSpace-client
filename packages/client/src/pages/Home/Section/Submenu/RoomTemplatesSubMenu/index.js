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

import { inject, observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import { Submenu } from "@docspace/shared/components/submenu";
import { SectionSubmenuSkeleton } from "@docspace/shared/skeletons/sections";
import RoomsFilter from "@docspace/shared/api/rooms/filter";
import { getObjectByLocation } from "@docspace/shared/utils/common";
import { RoomSearchArea } from "@docspace/shared/enums";
import { CategoryType } from "SRC_DIR/helpers/constants";
import { getCategoryUrl } from "SRC_DIR/helpers/utils";

const RoomTemplatesSubMenu = ({ setFilter, showBodyLoader, showSubmenu }) => {
  const { t } = useTranslation(["Common"]);

  const submenu = [
    {
      id: "rooms",
      name: t("Common:Rooms"),
    },
    {
      id: "templates",
      name: t("Common:Templates"),
    },
  ];

  const onSelect = (e) => {
    const filter = RoomsFilter.getDefault();

    let path;

    if (e.id === "templates") {
      filter.searchArea = RoomSearchArea.Templates;
      path = getCategoryUrl(CategoryType.Templates);
    } else {
      filter.searchArea = RoomSearchArea.Active;
      path = getCategoryUrl(CategoryType.Shared);
    }

    setFilter(filter);
    window.DocSpace.navigate(`${path}?${filter.toUrlParams()}`, {
      replace: true,
    });
  };

  const startSelect =
    getObjectByLocation(window.DocSpace.location)?.searchArea ===
    RoomSearchArea.Active
      ? 0
      : 1;

  if (showSubmenu && showBodyLoader) return <SectionSubmenuSkeleton />;

  return showSubmenu ? (
    <Submenu data={submenu} startSelect={startSelect} onSelect={onSelect} />
  ) : null;
};

export default inject(
  ({
    treeFoldersStore,
    filesStore,
    clientLoadingStore,
    selectedFolderStore,
  }) => {
    const { isRoomsFolderRoot, isTemplatesFolderRoot } = treeFoldersStore;
    const { setFilter } = filesStore;
    const { showBodyLoader } = clientLoadingStore;

    return {
      setFilter,
      showBodyLoader,
      showSubmenu:
        (isRoomsFolderRoot || isTemplatesFolderRoot) &&
        selectedFolderStore.security?.Create,
    };
  },
)(observer(RoomTemplatesSubMenu));

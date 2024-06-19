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

import { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";

import { TableHeader, TTableColumn } from "@docspace/shared/components/table";

import { UsersTableHeaderProps } from "../../../../types";

const TABLE_VERSION = "6";
const TABLE_COLUMNS = `nextcloudThirdColumns_ver-${TABLE_VERSION}`;

const getColumns = (defaultColumns: TTableColumn[], userId?: string) => {
  const storageColumns = localStorage.getItem(`${TABLE_COLUMNS}=${userId}`);

  if (storageColumns) {
    const splitColumns = storageColumns?.split(",");

    return defaultColumns.map((col) => ({
      ...col,
      enable: splitColumns.includes(col.key),
    }));
  }

  return defaultColumns;
};

const UsersTableHeader = (props: UsersTableHeaderProps) => {
  const {
    t,
    userId,
    sectionWidth,
    tableRef,
    columnStorageName,
    columnInfoPanelStorageName,
    isIndeterminate,
    isChecked,
    toggleAll,
  } = props;

  const [columns, setColumns] = useState<TTableColumn[]>([
    {
      key: "Name",
      title: t("Common:Name"),
      resizable: true,
      enable: true,
      default: true,
      active: true,
      minWidth: 180,
    },
  ]);

  function onColumnChange(key: string) {
    const columnIndex = columns.findIndex((c) => c.key === key);

    if (columnIndex === -1) return;

    setColumns((prevColumns: TTableColumn[]) =>
      prevColumns.map((item, index) =>
        index === columnIndex ? { ...item, enable: !item.enable } : item,
      ),
    );

    const tableColumns = columns.map((c) => c.enable && c.key);
    localStorage.setItem(`${TABLE_COLUMNS}=${userId}`, tableColumns.toString());
  }

  const defaultColumns: TTableColumn[] = [
    {
      key: "Name",
      title: t("Common:Name"),
      resizable: true,
      enable: true,
      default: true,
      active: true,
      minWidth: 180,
      checkbox: {
        value: isChecked,
        isIndeterminate,
        onChange: toggleAll,
      },
      onChange: onColumnChange,
    },
    {
      key: "Email",
      title: t("Common:Email"),
      enable: true,
      resizable: true,
      onChange: onColumnChange,
    },
  ];

  useEffect(() => {
    setColumns(getColumns(defaultColumns, userId));
  }, [isIndeterminate, isChecked]);

  return (
    <TableHeader
      containerRef={tableRef as { current: HTMLDivElement }}
      columns={columns}
      columnStorageName={columnStorageName}
      columnInfoPanelStorageName={columnInfoPanelStorageName}
      sectionWidth={sectionWidth}
      showSettings={false}
      useReactWindow
      infoPanelVisible={false}
    />
  );
};

export default inject<TStore>(({ userStore }) => {
  const userId = userStore.user?.id;
  return {
    userId,
  };
})(observer(UsersTableHeader));

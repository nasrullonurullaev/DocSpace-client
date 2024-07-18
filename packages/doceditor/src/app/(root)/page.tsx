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

import type { Metadata } from "next";
import { headers } from "next/headers";

import { getSelectorsByUserAgent } from "react-device-detect";

import { getData } from "@/utils/actions";
import { RootPageProps } from "@/types";
import Root from "@/components/Root";

const initialSearchParams: RootPageProps["searchParams"] = {
  fileId: undefined,
  fileid: undefined,
  version: undefined,
  doc: undefined,
  action: undefined,
  share: undefined,
  editorType: undefined,
};

const BRAND_NAME = "ONLYOFFICE"; //TODO: replace to t("Common:OrganizationName");

export const metadata: Metadata = {
  title: `${BRAND_NAME} DocEditor page`,

  description: "",
};

async function Page({ searchParams }: RootPageProps) {
  const { fileId, fileid, version, doc, action, share, editorType, error } =
    searchParams ?? initialSearchParams;

  const hdrs = headers();

  let type = editorType;

  const ua = hdrs.get("user-agent");
  if (ua && !type) {
    const { isMobile } = getSelectorsByUserAgent(ua);

    if (isMobile) type = "mobile";
  }

  const startDate = new Date();

  const data = await getData(
    fileId ?? fileid ?? "",
    version,
    doc,
    action,
    share,
    type,
  );

  const timer = new Date().getTime() - startDate.getTime();

  if (data.error?.status === "not-found" && error) {
    data.error.message = error;
  }

  return <Root {...data} timer={timer} />;
}

export default Page;

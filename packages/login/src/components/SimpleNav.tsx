/* eslint-disable @next/next/no-img-element */
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

"use client";

import React from "react";
import styled from "styled-components";

import { mobile } from "@docspace/shared/utils/device";
import { getLogoUrl } from "@docspace/shared/utils/common";
import { Base, Dark } from "@docspace/shared/themes";
import { ThemeKeys, WhiteLabelLogoType } from "@docspace/shared/enums";
import LanguageComboboxWrapper from "./LanguageCombobox";

const StyledSimpleNav = styled.div`
  display: none;
  height: 48px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme?.login?.navBackground};

  svg {
    path:last-child {
      fill: ${(props) => props.theme.client?.home?.logoColor};
    }
  }

  @media ${mobile} {
    display: flex;

    .language-combo-box {
      position: absolute;
      top: 7px;
      right: 8px;
    }
  }
`;

StyledSimpleNav.defaultProps = { theme: Base };

interface SimpleNavProps {
  systemTheme: ThemeKeys;
}

const SimpleNav = ({ systemTheme }: SimpleNavProps) => {
  const isDark = systemTheme === ThemeKeys.DarkStr;
  const logoUrl = getLogoUrl(WhiteLabelLogoType.LightSmall, isDark);

  return (
    <StyledSimpleNav id="login-header" theme={isDark ? Dark : Base}>
      <img src={logoUrl} alt="logo-url" />
      <LanguageComboboxWrapper />
    </StyledSimpleNav>
  );
};

export default SimpleNav;

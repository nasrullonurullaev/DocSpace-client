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
import React from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { mapCulturesToArray } from "../../utils/common";
import { isMobile } from "../../utils";
import { StyledComboBox } from "./LanguageCombobox.styled";
import { TCulture, ComboboxProps } from "./LanguageCombobox.types";

const LanguageCombobox = (props: ComboboxProps) => {
  const {
    cultures,
    onSelectLanguage,
    selectedCulture,
    className,
    withBorder = true,
  } = props;

  const { i18n } = useTranslation(["Common"]);

  const cultureNames = useMemo(() => {
    const withLabel = isMobile() ? i18n : undefined;

    return mapCulturesToArray(cultures, false, withLabel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cultures]);

  const currentCulture = cultureNames.find(
    (item) => item.key === selectedCulture,
  );

  const onSelect = (culture: TCulture) => {
    if (culture.key === selectedCulture) return;

    onSelectLanguage(culture);
  };

  if (!currentCulture) return <></>;

  return (
    <StyledComboBox
      className={`language-combo-box ${className}`}
      directionY="both"
      options={cultureNames}
      selectedOption={currentCulture}
      onSelect={onSelect}
      isDisabled={false}
      scaled={false}
      scaledOptions={false}
      size="content"
      showDisabledItems
      dropDownMaxHeight={300}
      fillIcon={false}
      displaySelectedOption
      manualWidth="41px"
      noBorder={false}
      type="onlyIcon"
      optionStyle={{ padding: "0 8px" }}
      style={{ padding: "6px 0px" }}
      isMobileView={isMobile()}
      withBlur={isMobile()}
      withBorder={withBorder}
    />
  );
};
export { LanguageCombobox };

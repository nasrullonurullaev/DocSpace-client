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

import React, { useRef } from "react";
import { ReactSVG } from "react-svg";

import TriangleNavigationDownReactSvgUrl from "PUBLIC_DIR/images/triangle.navigation.down.react.svg?url";

import { Text } from "../text";
import { ContextMenu, ContextMenuTypeOnClick } from "../context-menu";

import { GroupMainButton } from "./MainButton.styled";
import { MainButtonProps } from "./MainButton.types";
import MainButtonTheme from "./MainButton.theme";

const MainButton = (props: MainButtonProps) => {
  const { text, model, isDropdown, isDisabled, onAction } = props;
  const { id, ...rest } = props;

  const ref = useRef(null);
  const menuRef = useRef<null | {
    show: (e: React.MouseEvent) => void;
    hide: (e: React.MouseEvent) => void;
    toggle: (e: React.MouseEvent) => boolean;
    getVisible: () => boolean;
  }>(null);
  const visibleRef = useRef(false);

  const stopAction = (e: React.MouseEvent) => e.preventDefault();

  const toggle = (e: React.MouseEvent) => {
    if (!menuRef.current) return;

    const menu = menuRef.current;

    if (visibleRef.current) {
      menu.hide(e);
      visibleRef.current = false;
    } else {
      visibleRef.current = menu.toggle(e);
    }
  };

  const onMainButtonClick = (e: React.MouseEvent) => {
    if (!isDisabled) {
      if (!isDropdown) {
        onAction?.(e);
      } else {
        toggle(e);
      }
    } else {
      stopAction(e);
    }
  };

  const newModel = React.useMemo(() => {
    return model.map((m) => {
      if ("onClick" in m && m.onClick) {
        const onClick: ContextMenuTypeOnClick = (e) => {
          visibleRef.current = false;
          m.onClick?.(e);
        };
        return { ...m, onClick };
      }

      return m;
    });
  }, [model]);

  return (
    <GroupMainButton {...rest} ref={ref} data-testid="main-button">
      <MainButtonTheme {...rest} id={id} onClick={onMainButtonClick}>
        <Text className="main-button_text">{text}</Text>
        {isDropdown && (
          <>
            <ReactSVG
              className="main-button_img"
              src={TriangleNavigationDownReactSvgUrl}
            />

            <ContextMenu model={newModel} containerRef={ref} ref={menuRef} />
          </>
        )}
      </MainButtonTheme>
    </GroupMainButton>
  );
};

MainButton.defaultProps = {
  text: "Button",
  isDisabled: false,
  isDropdown: true,
};

export { MainButton };

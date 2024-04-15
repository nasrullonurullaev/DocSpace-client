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
import styled, { css } from "styled-components";

import { RectangleSkeleton, RectangleSkeletonProps } from "../rectangle";

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;

  overflow: hidden;

  display: flex;
  flex-direction: column;
`;

const StyledItem = styled.div<{ isUser?: boolean }>`
  width: 100%;
  height: 48px;
  min-height: 48px;

  padding: 0 16px;

  box-sizing: border-box;

  display: flex;
  align-items: center;

  .avatar {
    ${({ theme }) =>
      theme.interfaceDirection === "rtl"
        ? `margin-left: 8px;`
        : `margin-right: 8px;`}

    ${(props) =>
      props.isUser &&
      css`
        border-radius: 50px;
      `}
  }

  .checkbox {
    ${({ theme }) =>
      theme.interfaceDirection === "rtl"
        ? `margin-right: auto;`
        : `margin-left: auto;`}
  }
`;

const Divider = styled.div`
  height: 1px;
  margin: 12px 16px;
  border-bottom: ${(props) => props.theme.selector.border};
`;

interface RowLoaderProps extends RectangleSkeletonProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  isMultiSelect?: boolean;
  isContainer?: boolean;
  isUser?: boolean;
  withAllSelect?: boolean;
  count?: number;
}

const RowLoader = ({
  id,
  className,
  style,
  isMultiSelect,
  isContainer,
  isUser,
  withAllSelect,
  count = 5,
  ...rest
}: RowLoaderProps) => {
  const getRowItem = (key: number) => {
    return (
      <StyledItem
        id={id}
        className={className}
        style={style}
        isUser={isUser}
        key={`selector-row-${key}`}
        {...rest}
      >
        <RectangleSkeleton className="avatar" width="32px" height="32px" />
        <RectangleSkeleton width="212px" height="16px" />
        {isMultiSelect && (
          <RectangleSkeleton className="checkbox" width="16px" height="16px" />
        )}
      </StyledItem>
    );
  };

  const getRowItems = () => {
    const rows = [];
    for (let i = 0; i < count; i += 1) {
      rows.push(getRowItem(i));
    }

    return rows;
  };

  return isContainer ? (
    <StyledContainer
      id={id}
      className={className}
      key="test"
      style={style}
      {...rest}
    >
      {withAllSelect && (
        <>
          {getRowItem(-1)}
          <Divider />
        </>
      )}
      {getRowItems()}
    </StyledContainer>
  ) : (
    getRowItem(0)
  );
};

export default RowLoader;

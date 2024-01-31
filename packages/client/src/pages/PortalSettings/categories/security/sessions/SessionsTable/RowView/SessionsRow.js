import { inject, observer } from "mobx-react";
import { useCallback } from "react";
import { isMobile } from "react-device-detect";
import { Base } from "@docspace/shared/themes";
import { tablet } from "@docspace/shared/utils";
import { Row } from "@docspace/shared/components/row";
import styled, { css } from "styled-components";

import withContent from "SRC_DIR/HOCs/withPeopleContent";
import SessionsRowContent from "./SessionsRowContent";

import HistoryFinalizedReactSvgUrl from "PUBLIC_DIR/images/history-finalized.react.svg?url";
import RemoveSvgUrl from "PUBLIC_DIR/images/remove.session.svg?url";
import TrashReactSvgUrl from "PUBLIC_DIR/images/trash.react.svg?url";

const marginStyles = css`
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 24px;
  padding-right: 24px;

  @media ${tablet} {
    margin-left: -16px;
    margin-right: -16px;
    padding-left: 16px;
    padding-right: 16px;
  }
`;

const checkedStyle = css`
  background: ${(props) => props.theme.filesSection.rowView.checkedBackground};
  ${marginStyles}
`;

const Wrapper = styled.div`
  .user-item {
    border: 1px solid transparent;
    border-left: none;
    border-right: none;
    ${(props) =>
      props.theme.interfaceDirection === "rtl"
        ? css`
            margin-right: 0;
          `
        : css`
            margin-left: 0;
          `}
    height: 100%;
    user-select: none;

    position: relative;
    outline: none;
    background: none !important;
  }
`;

Wrapper.defaultProps = { theme: Base };

const StyledRow = styled(Row)`
  ${(props) => (props.checked || props.isActive) && checkedStyle};

  ${!isMobile &&
  css`
    :hover {
      cursor: pointer;
      ${checkedStyle}

      margin-top: -3px;
      padding-bottom: 1px;
      border-top: ${(props) =>
        `1px ${props.theme.filesSection.tableView.row.borderColor} solid`};
      border-bottom: ${(props) =>
        `1px ${props.theme.filesSection.tableView.row.borderColor} solid`};
    }
  `}

  position: unset;
  margin-top: -2px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  .styled-checkbox-container {
    .checkbox {
      padding-right: 4px;
    }
  }

  .styled-element {
    height: 32px;
    ${(props) =>
      props.theme.interfaceDirection === "rtl"
        ? css`
            margin-left: 12px;
          `
        : css`
            margin-right: 12px;
          `}
  }
`;

const SessionsRow = (props) => {
  const {
    t,
    sectionWidth,
    item,
    checkedProps,
    onContentRowSelect,
    onContentRowClick,
    element,
    isActive,
    setLogoutAllDialogVisible,
    setDisableDialogVisible,
    setSessionModalData,
    setUserSessionPanelVisible,
  } = props;

  const isChecked = checkedProps.checked;

  const onRowClick = useCallback(() => {
    onContentRowClick && onContentRowClick(!isChecked, item);
  }, [isChecked, item, onContentRowClick]);

  const onRowContextClick = useCallback(() => {
    onContentRowClick && onContentRowClick(!isChecked, item, false);
  }, [isChecked, item, onContentRowClick]);

  const onClickSessions = () => {
    setSessionModalData({ ...item });
    setUserSessionPanelVisible(true);
  };

  const onClickLogout = () => {
    setLogoutAllDialogVisible(true);
    setSessionModalData({ displayName: item.displayName });
  };

  const onClickDisable = () => {
    setDisableDialogVisible(true);
  };

  const contextOptions = [
    {
      key: "ViewSessions",
      label: t("Settings:ViewSessions"),
      icon: HistoryFinalizedReactSvgUrl,
      onClick: onClickSessions,
    },
    {
      key: "LogoutAllSessions",
      label: t("Settings:LogoutAllSessions"),
      icon: RemoveSvgUrl,
      onClick: onClickLogout,
    },
    {
      key: "Separator",
      isSeparator: true,
    },
    {
      key: "Disable",
      label: t("Common:DisableUserButton"),
      icon: TrashReactSvgUrl,
      onClick: onClickDisable,
    },
  ];

  return (
    <Wrapper
      className={`user-item row-wrapper ${
        isChecked || isActive ? "row-selected" : ""
      }`}
    >
      <div className="user-item">
        <StyledRow
          key={item.userId}
          data={item}
          element={element}
          onSelect={onContentRowSelect}
          checked={isChecked}
          isActive={isActive}
          sectionWidth={sectionWidth}
          mode={"modern"}
          className={"user-row"}
          contextOptions={contextOptions}
          onRowClick={onRowClick}
          onContextClick={onRowContextClick}
        >
          <SessionsRowContent {...props} />
        </StyledRow>
      </div>
    </Wrapper>
  );
};

export default inject(({ setup, dialogsStore }) => {
  const { setUserSessionPanelVisible } = dialogsStore;
  const {
    setLogoutAllDialogVisible,
    setDisableDialogVisible,
    setSessionModalData,
  } = setup;

  return {
    setLogoutAllDialogVisible,
    setDisableDialogVisible,
    setSessionModalData,
    setUserSessionPanelVisible,
  };
})(withContent(observer(SessionsRow)));

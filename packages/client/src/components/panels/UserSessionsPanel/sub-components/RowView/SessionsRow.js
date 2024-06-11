import { inject, observer } from "mobx-react";
import { Row } from "@docspace/shared/components/row";
import { IconButton } from "@docspace/shared/components/icon-button";
import styled from "styled-components";

import SessionsRowContent from "./SessionsRowContent";
import RemoveSessionSvgUrl from "PUBLIC_DIR/images/remove.session.svg?url";

const StyledRow = styled(Row)`
  min-height: 56px;
`;

const SessionsRow = (props) => {
  const { item, sectionWidth, setLogoutDialogVisible, setPlatformData } = props;

  const onClickDisable = () => {
    setLogoutDialogVisible(true);
    setPlatformData(item);
  };

  const contentElement = (
    <IconButton
      size={20}
      iconName={RemoveSessionSvgUrl}
      isClickable
      onClick={onClickDisable}
    />
  );

  return (
    <StyledRow
      key={item.id}
      data={item}
      sectionWidth={sectionWidth}
      contentElement={contentElement}
    >
      <SessionsRowContent {...props} />
    </StyledRow>
  );
};

export default inject(({ setup, peopleStore }) => {
  const { platformData, setPlatformData } = peopleStore.selectionStore;
  const { setLogoutDialogVisible, setPlatformModalData } = setup;

  return {
    setLogoutDialogVisible,
    setPlatformModalData,
    platformData,
    setPlatformData,
  };
})(observer(SessionsRow));

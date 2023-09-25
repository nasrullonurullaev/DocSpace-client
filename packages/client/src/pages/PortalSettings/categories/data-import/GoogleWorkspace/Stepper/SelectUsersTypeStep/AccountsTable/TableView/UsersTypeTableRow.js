import { useRef } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components";

import TableRow from "@docspace/components/table-container/TableRow";
import TableCell from "@docspace/components/table-container/TableCell";
import Text from "@docspace/components/text";
import Checkbox from "@docspace/components/checkbox";
import ComboBox from "@docspace/components/combobox";

const StyledTableRow = styled(TableRow)`
  .table-container_cell {
    padding-right: 30px;
    text-overflow: ellipsis;
  }

  .username {
    font-size: 13px;
    font-weight: 600;
    color: ${(props) => props.theme.client.settings.migration.subtitleColor};
  }

  .user-email {
    margin-right: 5px;
    font-size: 13px;
    font-weight: 600;
    color: ${(props) =>
      props.theme.client.settings.migration.tableRowTextColor};
  }

  .user-type {
    .combo-button {
      border: none;
      padding: 0;
      justify-content: flex-start;
      background-color: transparent;
    }

    .combo-button-label {
      color: ${(props) =>
        props.theme.client.settings.migration.tableRowTextColor};
    }

    .combo-buttons_arrow-icon {
      flex: initial;
      margin-left: 0;
    }

    svg {
      path {
        fill: ${(props) =>
          props.theme.client.settings.migration.tableRowTextColor};
      }
    }
  }
`;

const UsersTypeTableRow = ({
  id,
  displayName,
  email,
  typeOptions,
  isChecked,
  toggleAccount,
  type,
  changeType,
}) => {
  const userTypeRef = useRef();

  const onSelectUser = (e) => {
    changeType(id, e.key);
  };

  const selectedOption =
    typeOptions.find((option) => option.key === type) || {};

  const handleAccountToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.closest(".dropdown-container") ||
      userTypeRef.current?.contains(e.target) ||
      toggleAccount(e);
  };

  return (
    <StyledTableRow checked={isChecked} onClick={handleAccountToggle}>
      <TableCell>
        <Checkbox isChecked={isChecked} onChange={handleAccountToggle} />
        <Text className="username">{displayName}</Text>
      </TableCell>

      <TableCell>
        <div ref={userTypeRef}>
          <ComboBox
            className="user-type"
            selectedOption={selectedOption}
            options={typeOptions}
            onSelect={onSelectUser}
            scaled
            size="content"
            displaySelectedOption
            modernView
            manualWidth="fit-content"
          />
        </div>
      </TableCell>

      <TableCell>
        <Text className="user-email">{email}</Text>
      </TableCell>
    </StyledTableRow>
  );
};

export default inject(({ importAccountsStore }) => {
  const { changeType } = importAccountsStore;

  return {
    changeType,
  };
})(observer(UsersTypeTableRow));

import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";

import TableRow from "@docspace/components/table-container/TableRow";
import TableCell from "@docspace/components/table-container/TableCell";
import Link from "@docspace/components/link";
import Text from "@docspace/components/text";
import Checkbox from "@docspace/components/checkbox";
import ComboBox from "@docspace/components/combobox";
import DropDownItem from "@docspace/components/drop-down-item";

import withContextOptions from "SRC_DIR/HOCs/withPeopleContextOptions";
import withContent from "SRC_DIR/HOCs/withPeopleContent";

import Badges from "../Badges";

const StyledPeopleRow = styled(TableRow)`
  .table-container_cell {
    height: 46px;
    max-height: 46px;
  }

  .table-container_row-checkbox-wrapper {
    padding-right: 0px;
    padding-left: 4px;
    min-width: 46px;

    .table-container_row-checkbox {
      margin-left: -4px;
      padding: 16px 0px 16px 12px;
    }
  }

  .link-with-dropdown-group {
    margin-right: 12px;
  }

  .table-cell_username {
    margin-right: 12px;
  }

  .table-container_row-context-menu-wrapper {
    padding-right: 0px;
  }

  .table-cell_type,
  .table-cell_room {
    margin-left: -8px;
  }

  .type-combobox,
  .room-combobox {
    padding-left: 8px;
    .combo-button {
      padding-left: 8px;
      margin-left: -8px;

      .combo-button-label {
        font-size: 12px;
        font-weight: 400;
        color: ${(props) => props.sideInfoColor};
      }

      .combo-buttons_arrow-icon {
        svg {
          path {
            fill: ${(props) => props.sideInfoColor};
          }
        }
      }
    }
  }

  .room-combobox {
    .combo-buttons_arrow-icon {
      display: none;
    }
  }
`;

const fakeRooms = [
  {
    name: "Room 1",
    role: "Viewer",
  },
  {
    name: "Room 2",
    role: "Co-worker",
  },
];

const PeopleTableRow = (props) => {
  const {
    t,
    item,
    contextOptionsProps,
    element,
    checkedProps,
    onContentRowSelect,
    onEmailClick,
    onUserNameClick,
    isAdmin,
    theme,
  } = props;
  const { displayName, email, statusType, userName, position, role } = item;

  const isPending = statusType === "pending" || statusType === "disabled";

  const nameColor = isPending
    ? theme.peopleTableRow.pendingNameColor
    : theme.peopleTableRow.nameColor;
  const sideInfoColor = theme.peopleTableRow.sideInfoColor;

  const onChange = (e) => {
    onContentRowSelect && onContentRowSelect(e.target.checked, item);
  };

  const getTypesOptions = React.useCallback(() => {
    const options = [
      {
        key: "admin",
        title: t("Administrator"),
        label: t("Administrator"),
        action: "administrator",
      },
      {
        key: "manager",
        title: t("Manager"),
        label: t("Manager"),
        action: "manager",
      },
      {
        key: "user",
        title: t("Common:User"),
        label: t("Common:User"),
        action: "user",
      },
    ];

    return options;
  }, [t]);

  // TODO: update after backend update
  const onTypeChange = React.useCallback(({ action }) => {}, []);

  const getRoomsOptions = React.useCallback(() => {
    const options = [];

    fakeRooms.forEach((room) => {
      options.push(
        <DropDownItem key={room.name} noHover={true}>
          {room.name} &nbsp;
          <Text fontSize="13px" fontWeight={600} color={sideInfoColor} truncate>
            ({room.role})
          </Text>
        </DropDownItem>
      );
    });

    return <>{options.map((option) => option)}</>;
  }, []);

  return (
    <StyledPeopleRow
      key={item.id}
      sideInfoColor={sideInfoColor}
      {...contextOptionsProps}
    >
      <TableCell>
        <TableCell
          hasAccess={isAdmin}
          className="table-container_row-checkbox-wrapper"
          checked={checkedProps.checked}
        >
          <div className="table-container_element">{element}</div>
          <Checkbox
            className="table-container_row-checkbox"
            onChange={onChange}
            isChecked={checkedProps.checked}
          />
        </TableCell>

        <Link
          type="page"
          title={displayName}
          fontWeight="600"
          fontSize="15px"
          color={nameColor}
          isTextOverflow
          href={`/accounts/view/${userName}`}
          onClick={onUserNameClick}
          className="table-cell_username"
        >
          {displayName}
        </Link>
        <Badges statusType={statusType} />
      </TableCell>
      <TableCell className={"table-cell_type"}>
        {role === "owner" ? (
          <Text
            type="page"
            title={position}
            fontSize="12px"
            fontWeight={400}
            color={sideInfoColor}
            truncate
            style={{ paddingLeft: "8px" }}
          >
            {t("Common:Owner")}
          </Text>
        ) : (
          <ComboBox
            className="type-combobox"
            selectedOption={getTypesOptions().find(
              (option) => option.key === role
            )}
            options={getTypesOptions()}
            onSelect={onTypeChange}
            scaled={false}
            size="content"
            displaySelectedOption
            modernView
          />
        )}
      </TableCell>
      <TableCell className="table-cell_room">
        {isPending && statusType !== "disabled" ? (
          <Text
            type="page"
            title={position}
            fontSize="12px"
            fontWeight={400}
            color={sideInfoColor}
            truncate
            style={{ paddingLeft: "8px" }}
          >
            —
          </Text>
        ) : role === "owner" ? (
          <Text
            type="page"
            title={position}
            fontSize="12px"
            fontWeight={400}
            color={sideInfoColor}
            truncate
            style={{ paddingLeft: "8px" }}
          >
            {fakeRooms[0].name} ({fakeRooms[0].role})
          </Text>
        ) : (
          <ComboBox
            className="room-combobox"
            selectedOption={{ key: "length", label: `${fakeRooms.length}` }}
            options={[]}
            onSelect={onTypeChange}
            advancedOptions={getRoomsOptions()}
            scaled={false}
            size="content"
            displaySelectedOption
            modernView
          />
        )}
      </TableCell>
      <TableCell>
        <Link
          type="page"
          title={email}
          fontSize="12px"
          fontWeight={400}
          color={sideInfoColor}
          onClick={onEmailClick}
          isTextOverflow
        >
          {email}
        </Link>
      </TableCell>
    </StyledPeopleRow>
  );
};

export default withTranslation(["People", "Common"])(
  withRouter(withContextOptions(withContent(PeopleTableRow)))
);

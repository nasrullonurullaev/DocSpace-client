import * as Styled from "./index.styled";

import { useRef, useState } from "react";
import { inject } from "mobx-react";
import { withTranslation } from "react-i18next";
import SortReactSvgUrl from "PUBLIC_DIR/images/sort.react.svg?url";
import IconButton from "@docspace/components/icon-button";
import ComboBox from "@docspace/components/combobox";
import SortDesc from "PUBLIC_DIR/images/sort.desc.react.svg";
import Backdrop from "@docspace/components/backdrop";
import Text from "@docspace/components/text";
import OformsFilter from "@docspace/common/api/oforms/filter";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const sortData = [
  {
    id: "sort-by_name",
    key: "name_form",
    label: "Name",
    default: true,
    isSelected: true,
  },
];

const SortFilter = ({ t, oformsFilter, getOforms }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortby");
  const sortOrder = searchParams.get("sortorder");

  const [isOpen, setIsOpen] = useState(false);
  const onToggleCombobox = () => setIsOpen(!isOpen);
  const onCloseCombobox = () => setIsOpen(false);

  const onSetSortBy = (sortBy) => {
    const newFilter = oformsFilter.clone();
    newFilter.sortBy = sortBy;
    if (!sortOrder) newFilter.sortOrder = "asc";
    getOforms(newFilter);
    navigate(`${location.pathname}?${newFilter.toUrlParams()}`);

    onCloseCombobox();
  };

  const onToggleSortOrder = (e, sortBy) => {
    e.stopPropagation();

    const newFilter = oformsFilter.clone();
    newFilter.sortBy = sortBy;
    newFilter.sortOrder = sortOrder === "desc" ? "asc" : "desc";
    getOforms(newFilter);
    navigate(`${location.pathname}?${newFilter.toUrlParams()}`);

    onCloseCombobox();
  };

  return (
    <>
      <Backdrop
        visible={isOpen}
        withBackground={false}
        onClick={onToggleCombobox}
        withoutBlur={true}
      />
      <Styled.SortButton
        id={"oform-sort"}
        title={"Sort"}
        onClick={onToggleCombobox}
      >
        <ComboBox
          opened={isOpen}
          onToggle={onToggleCombobox}
          className={"sort-combo-box"}
          options={[]}
          selectedOption={{}}
          directionX={"right"}
          directionY={"both"}
          scaled={true}
          size={"content"}
          advancedOptions={
            <>
              {sortData?.map((item) => (
                <Styled.SortDropdownItem
                  id={item.id}
                  onClick={() => onSetSortBy(item.key)}
                  key={item.key}
                  data-value={item.key}
                  isSelected={sortBy === item.key}
                  isDescending={sortOrder === "desc"}
                >
                  <Text fontWeight={600}>{t(`Common:${item.label}`)}</Text>
                  <SortDesc
                    onClick={(e) => onToggleSortOrder(e, item.key)}
                    className="sortorder-arrow"
                  />
                </Styled.SortDropdownItem>
              ))}
            </>
          }
          advancedOptionsCount={sortData.length}
          disableIconClick={false}
          disableItemClick={true}
          isDefaultMode={false}
          manualY={"102%"}
        >
          <IconButton iconName={SortReactSvgUrl} size={16} />
        </ComboBox>
      </Styled.SortButton>
    </>
  );
};

export default inject(({ oformsStore }) => ({
  oformsFilter: oformsStore.oformsFilter,
  getOforms: oformsStore.getOforms,
}))(withTranslation(["FormGallery", "Common"])(SortFilter));

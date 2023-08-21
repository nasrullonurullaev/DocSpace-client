import styled from "styled-components";
import { inject, observer } from "mobx-react";

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CategoryFilter from "./CategoryFilter";
import LanguageFilter from "./LanguageFilter";
import SearchFilter from "./SearchFilter";
import SortFilter from "./SortFilter";
import { smallTablet } from "@docspace/components/utils/device";
import OformsFilter from "@docspace/common/api/oforms/filter";

export const StyledFilter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 32px;
  padding: 8px 0;

  .form-only-filters {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .general-filters {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;
    gap: 8px;
  }

  @media ${smallTablet} {
    height: 72px;
    flex-direction: column-reverse;

    .form-only-filters {
      width: 100%;
    }
  }
`;

const SectionFilterContent = ({}) => {
  return (
    <StyledFilter>
      <div className="form-only-filters">
        <CategoryFilter />
        <LanguageFilter />
      </div>
      <div className="general-filters">
        <SearchFilter />
        <SortFilter />
      </div>
    </StyledFilter>
  );
};

export default inject(({}) => ({}))(observer(SectionFilterContent));

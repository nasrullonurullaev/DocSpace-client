import { StyledSubItemMobile } from "./index.styled";
import { inject } from "mobx-react";
import { withTranslation } from "react-i18next";
import { getOformCategoryTitle } from "@docspace/client/src/helpers/utils";
import { getDefaultOformLocale } from "@docspace/common/utils";

const categoryLocale = getDefaultOformLocale();

const CategorySubList = ({
  categoryType,
  categories,

  filterOformsByCategory,
  setOformsCurrentCategory,
}) => {
  const onFilterByCategory = (category) => {
    setOformsCurrentCategory(category);
    filterOformsByCategory(categoryType, category.id);
  };

  return categories.map((category) => (
    <StyledSubItemMobile
      className="dropdown-item item-mobile"
      key={category.id}
      label={getOformCategoryTitle(category, categoryLocale)}
      onClick={() => onFilterByCategory(category)}
    />
  ));
};

export default inject(({ oformsStore }) => ({
  filterOformsByCategory: oformsStore.filterOformsByCategory,
  setOformsCurrentCategory: oformsStore.setOformsCurrentCategory,
}))(withTranslation(["FormGallery", "Common"])(CategorySubList));

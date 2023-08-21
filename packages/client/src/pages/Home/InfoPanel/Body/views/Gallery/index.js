import React from "react";
import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";
import { ReactSVG } from "react-svg";

import withLoader from "@docspace/client/src/HOCs/withLoader";
import Loaders from "@docspace/common/components/Loaders/index.js";

import Text from "@docspace/components/text";

import { parseAndFormatDate } from "../../helpers/DetailsHelper.js";
import { StyledGalleryThumbnail } from "../../styles/gallery.js";
import {
  StyledDescription,
  StyledLink,
  StyledProperties,
  StyledSubtitle,
} from "../../styles/common.js";
import Link from "@docspace/components/link/index.js";

const Gallery = ({ t, gallerySelected, getIcon, culture, personal }) => {
  const thumbnailBlank = getIcon(96, ".docxf");
  const thumbnailUrl =
    gallerySelected?.attributes?.template_image?.data.attributes?.formats?.small
      ?.url;

  return (
    <>
      {thumbnailUrl ? (
        <StyledGalleryThumbnail>
          <img className="info-panel_gallery-img" src={thumbnailUrl} alt="" />
        </StyledGalleryThumbnail>
      ) : (
        <div className="no-thumbnail-img-wrapper">
          <ReactSVG className="no-thumbnail-img" src={thumbnailBlank} />
        </div>
      )}

      <StyledLink>
        <Link
          className="link"
          href={"https://oforms.onlyoffice.com/form-submit"}
          target="_blank"
          type="action"
          isHovered
        >
          {t("FormGallery:SuggestChanges")}
        </Link>
      </StyledLink>

      <StyledSubtitle>
        <Text fontWeight="600" fontSize="14px">
          {t("Description")}
        </Text>
      </StyledSubtitle>

      <StyledDescription>
        Fill out the form online and get a recipe page ready, or just download
        the template in the desirable format: DOCXF, OFORM, or PDF. Designing
        custom recipe cards or pages helps create useful complimentary content
        for cooking blogs, culinary websites, or restaurants.
      </StyledDescription>

      <StyledSubtitle>
        <Text fontWeight="600" fontSize="14px">
          {t("Properties")}
        </Text>
      </StyledSubtitle>

      <StyledProperties>
        <div className="property">
          <Text className="property-title">{t("InfoPanel:DateModified")}</Text>
          <Text className="property-content">
            {parseAndFormatDate(
              gallerySelected.attributes.updatedAt,
              personal,
              culture
            )}
          </Text>
        </div>
        <div className="property">
          <Text className="property-title">{t("Common:Size")}</Text>
          <Text className="property-content">
            {gallerySelected.attributes.file_size}
          </Text>
        </div>
        <div className="property">
          <Text className="property-title">{t("Common:Pages")}</Text>
          <Text className="property-content">
            {gallerySelected.attributes.file_pages}
          </Text>
        </div>
      </StyledProperties>
    </>
  );
};

export default inject(({ auth, settingsStore, oformsStore }) => {
  const { personal, culture } = auth.settingsStore;
  const { gallerySelected } = oformsStore;
  const { getIcon } = settingsStore;
  return {
    getIcon,
    gallerySelected,
    personal,
    culture,
  };
})(
  withTranslation(["InfoPanel", "FormGallery", "Common", "Translations"])(
    Gallery
    // withLoader(observer(Gallery))(
    //   <Loaders.InfoPanelViewLoader view="gallery" />
    // )
  )
);

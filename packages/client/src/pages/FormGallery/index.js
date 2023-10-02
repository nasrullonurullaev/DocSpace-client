import React, { useState, useEffect } from "react";
import Section from "@docspace/common/components/Section";
import { observer, inject } from "mobx-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import SectionHeaderContent from "./Header";
import SectionBodyContent from "./Body";
import { InfoPanelBodyContent } from "../Home/InfoPanel";
import InfoPanelHeaderContent from "../Home/InfoPanel/Header";
import SectionFilterContent from "./Filter";
import OformsFilter from "@docspace/common/api/oforms/filter";
import Dialogs from "./Dialogs";
import { CategoryType } from "@docspace/client/src/helpers/constants";

const FormGallery = ({
  currentCategory,
  fetchCurrentCategory,
  defaultOformLocale,
  oformsFilter,
  setOformsFilter,
  getOforms,
  setOformFromFolderId,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fromFolderId } = useParams();

  const [isInitLoading, setIsInitLoading] = useState(true);

  useEffect(() => {
    if (!isInitLoading && location.search !== `?${oformsFilter.toUrlParams()}`)
      navigate(`${location.pathname}?${oformsFilter.toUrlParams()}`);
  }, [oformsFilter]);

  useEffect(() => {
    if (!currentCategory) fetchCurrentCategory();
  }, [oformsFilter]);

  useEffect(() => {
    if (fromFolderId) setOformFromFolderId(fromFolderId);
    else {
      const sharedRoomId = CategoryType.SharedRoom;
      setOformFromFolderId(sharedRoomId);
      navigate(
        `/form-gallery/${sharedRoomId}/filter?${oformsFilter.toUrlParams()}`
      );
    }
  }, [fromFolderId]);

  useEffect(() => {
    const firstLoadFilter = OformsFilter.getFilter(location);
    if (!firstLoadFilter.locale) firstLoadFilter.locale = defaultOformLocale;

    setOformsFilter(firstLoadFilter);
    getOforms(firstLoadFilter);

    setIsInitLoading(false);
  }, []);

  return (
    <>
      <Section
        // withBodyScroll
        // withBodyAutoFocus={!isMobile}
        withPaging={false}
      >
        <Section.SectionHeader>
          <SectionHeaderContent />
        </Section.SectionHeader>

        <Section.SectionFilter>
          <SectionFilterContent />
        </Section.SectionFilter>

        <Section.SectionBody>
          <SectionBodyContent />
        </Section.SectionBody>

        <Section.InfoPanelHeader>
          <InfoPanelHeaderContent isGallery />
        </Section.InfoPanelHeader>

        <Section.InfoPanelBody>
          <InfoPanelBodyContent isGallery />
        </Section.InfoPanelBody>
      </Section>

      <Dialogs />
    </>
  );
};

export default inject(({ oformsStore }) => ({
  currentCategory: oformsStore.currentCategory,
  fetchCurrentCategory: oformsStore.fetchCurrentCategory,

  defaultOformLocale: oformsStore.defaultOformLocale,

  oformsFilter: oformsStore.oformsFilter,
  setOformsFilter: oformsStore.setOformsFilter,

  getOforms: oformsStore.getOforms,
  setOformFromFolderId: oformsStore.setOformFromFolderId,
}))(observer(FormGallery));

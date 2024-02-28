import React from "react";
import { inject, observer } from "mobx-react";
import { useLocation } from "react-router-dom";

import { SettingsSectionBodyContent } from "../Section";

import {
  SettingsAdminSkeleton,
  SettingsCommonSkeleton,
} from "@docspace/shared/skeletons/settings";

const SettingsView = ({
  isLoading,
  isLoadedSettingsTree,

  isAdmin,
}) => {
  const location = useLocation();

  const inLoad = (!isLoadedSettingsTree && isLoading) || isLoading;

  const setting = location.pathname.includes("/settings/general")
    ? "general"
    : "personal";
  return (
    <>
      {inLoad ? (
        setting === "personal" ? (
          <SettingsCommonSkeleton isAdmin={isAdmin} />
        ) : (
          <SettingsAdminSkeleton />
        )
      ) : (
        <SettingsSectionBodyContent />
      )}
    </>
  );
};

export default inject(
  ({ authStore, clientLoadingStore, filesSettingsStore }) => {
    const { isLoading } = clientLoadingStore;

    const { isLoadedSettingsTree } = filesSettingsStore;

    return {
      isLoading,
      isLoadedSettingsTree,

      isAdmin: authStore.isAdmin,
    };
  },
)(observer(SettingsView));

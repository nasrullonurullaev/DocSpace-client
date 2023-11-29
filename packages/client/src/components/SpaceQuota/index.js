import React, { useState } from "react";
import { inject, observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import { getConvertedQuota } from "@docspace/common/utils";
import Text from "@docspace/components/text";
import ComboBox from "@docspace/components/combobox";
import toastr from "@docspace/components/toast/toastr";

import { StyledBody, StyledText } from "./StyledComponent";

const SpaceQuota = (props) => {
  const {
    hideColumns,
    isReadOnly,
    withoutLimitQuota,
    item,
    className,
    changeQuota,
    onSuccess,
    onAbort,
    updateQuota,
    resetQuota,
    defaultSize,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(["Common"]);

  const usedQuota = getConvertedQuota(t, item?.usedSpace);
  const spaceLimited = getConvertedQuota(t, item?.quotaLimit);
  const defaultQuotaSize = getConvertedQuota(t, defaultSize);

  const options = [
    {
      id: "info-account-quota_edit",
      key: "change-quota",
      label: t("Common:ChangeQuota"),
      action: "change",
    },
    {
      id: "info-account-quota_current-size",
      key: "current-size",
      label: spaceLimited,
      action: "current-size",
    },
    {
      id: "info-account-quota_no-quota",
      key: "no-quota",
      label:
        item?.quotaLimit === -1
          ? t("Common:Unlimited")
          : t("Common:DisableQuota"),
      action: "no-quota",
    },
  ];

  if (item.isCustomQuota)
    options?.splice(1, 0, {
      id: "info-account-quota_no-quota",
      key: "default-quota",
      label: t("Common:SetToDefault"),
      action: "default",
    });

  const successCallback = (users) => {
    onSuccess && onSuccess(users);
    setIsLoading(false);
  };

  const abortCallback = () => {
    onAbort && onAbort();
    setIsLoading(false);
  };

  const onChange = async ({ action }) => {
    if (action === "change") {
      setIsLoading(true);

      changeQuota([item], successCallback, abortCallback);

      return;
    }

    if (action === "no-quota") {
      options.map((item) => {
        if (item.key === "no-quota") item.label = t("Common:Unlimited");
      });

      try {
        const users = await updateQuota(-1, [item.id]);
        successCallback(users);
        toastr.success(t("Common:StorageQuotaDisabled"));
      } catch (e) {
        abortCallback();
        toastr.error(e);
      }

      return;
    }

    options.map((item) => {
      if (item.key === "default-quota") item.label = defaultQuotaSize;
    });

    try {
      const users = await resetQuota([item.id]);
      successCallback(users);
      toastr.success(t("Common:StorageQuotaReset"));
    } catch (e) {
      abortCallback();
      toastr.error(e);
    }
  };

  const action = item?.quotaLimit === -1 ? "no-quota" : "current-size";

  const selectedOption = options.find((elem) => elem.action === action);

  if (withoutLimitQuota) {
    return <StyledText fontWeight={600}>{usedQuota}</StyledText>;
  }

  if (isReadOnly) {
    return (
      <StyledText fontWeight={600}>
        {usedQuota} / {spaceLimited}
      </StyledText>
    );
  }

  return (
    <StyledBody hideColumns={hideColumns}>
      <Text fontWeight={600}>{usedQuota} / </Text>

      <ComboBox
        className={className}
        selectedOption={selectedOption}
        options={options}
        onSelect={onChange}
        scaled={false}
        size="content"
        modernView
        isLoading={isLoading}
        manualWidth="fit-content"
      />
    </StyledBody>
  );
};

export default inject(
  ({ peopleStore, filesActionsStore, filesStore, auth }, { type }) => {
    const { changeUserQuota, usersStore } = peopleStore;
    const { setCustomUserQuota, resetUserQuota } = usersStore;
    const { changeRoomQuota } = filesActionsStore;
    const { updateRoomQuota } = filesStore;
    const { currentQuotaStore } = auth;
    const {
      isDefaultUsersQuotaSet,
      isDefaultRoomsQuotaSet,
      defaultUsersQuota,
      defaultRoomsQuota,
    } = currentQuotaStore;

    const changeQuota = type === "user" ? changeUserQuota : changeRoomQuota;
    const updateQuota = type === "user" ? setCustomUserQuota : updateRoomQuota;

    const resetQuota = type === "user" ? resetUserQuota : null;

    const withoutLimitQuota =
      type === "user" ? !isDefaultUsersQuotaSet : !isDefaultRoomsQuotaSet;

    const defaultSize = type === "user" ? defaultUsersQuota : defaultRoomsQuota;

    return {
      withoutLimitQuota,
      changeQuota,
      updateQuota,
      resetQuota,
      defaultSize,
    };
  }
)(observer(SpaceQuota));

import React, { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import { withTranslation, Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { ModalDialog } from "@docspace/shared/components/modal-dialog";
import { Button } from "@docspace/shared/components/button";
import { Text } from "@docspace/shared/components/text";

import { getDaysRemaining } from "@docspace/shared/utils/common";

const InviteUsersWarningDialog = (props) => {
  const {
    t,
    tReady,

    language,
    dueDate,
    delayDueDate,
    visible,
    setIsVisible,
    isGracePeriod,
    currentTariffPlanTitle,
    isPaymentPageAvailable,
  } = props;

  const navigate = useNavigate();

  const [datesData, setDatesData] = useState({});

  const { fromDate, byDate, delayDaysCount } = datesData;

  useEffect(() => {
    moment.locale(language);
    if (window.timezone) moment().tz(window.timezone);

    gracePeriodDays();
  }, [language, gracePeriodDays, window.timezone]);

  const gracePeriodDays = () => {
    const fromDateMoment = moment(dueDate);
    const byDateMoment = moment(delayDueDate);

    setDatesData({
      fromDate: fromDateMoment.format("LL"),
      byDate: byDateMoment.format("LL"),
      delayDaysCount: getDaysRemaining(byDateMoment),
    });
  };

  const onClose = () => setIsVisible(false);

  const onUpgradePlan = () => {
    onClose();

    const paymentPageUrl = "/portal-settings/payments/portal-payments";

    navigate(paymentPageUrl);
  };

  return (
    <ModalDialog
      isLarge={isGracePeriod}
      isLoading={!tReady}
      visible={visible}
      onClose={onClose}
      displayType="modal"
    >
      <ModalDialog.Header>{t("Common:Warning")}</ModalDialog.Header>
      <ModalDialog.Body>
        {isGracePeriod ? (
          <>
            <Text fontWeight={700} noSelect>
              {t("BusinessPlanPaymentOverdue", {
                planName: currentTariffPlanTitle,
              })}
            </Text>
            <br />
            <Text noSelect as="div">
              <Trans t={t} i18nKey="GracePeriodActivatedInfo" ns="Payments">
                Grace period activated
                <strong>
                  from {{ fromDate }} to {{ byDate }}
                </strong>
                (days remaining: {{ delayDaysCount }})
              </Trans>
            </Text>
            <br />
            <Text>{t("GracePeriodActivatedDescription")}</Text>
          </>
        ) : (
          <>
            <Text fontWeight={700} noSelect>
              {t("PaymentOverdue")}
            </Text>
            <br />
            <Text>{t("UpgradePlanInfo")}</Text>
            <br />
            <Text>{t("ChooseNewPlan")}</Text>
          </>
        )}
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          key="OkButton"
          label={
            isPaymentPageAvailable ? t("UpgradePlan") : t("Common:OKButton")
          }
          size="normal"
          primary
          onClick={isPaymentPageAvailable ? onUpgradePlan : onClose}
          scale={isPaymentPageAvailable}
        />
        {isPaymentPageAvailable && (
          <Button
            key="CancelButton"
            label={t("Common:CancelButton")}
            size="normal"
            onClick={onClose}
            scale
          />
        )}
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default inject(
  ({
    authStore,
    dialogsStore,
    currentTariffStatusStore,
    currentQuotaStore,
  }) => {
    const { isPaymentPageAvailable } = authStore;
    const { dueDate, delayDueDate, isGracePeriod } = currentTariffStatusStore;
    const { currentTariffPlanTitle } = currentQuotaStore;

    const {
      inviteUsersWarningDialogVisible,
      setInviteUsersWarningDialogVisible,
    } = dialogsStore;

    return {
      isPaymentPageAvailable,
      currentTariffPlanTitle,
      language: authStore.language,
      visible: inviteUsersWarningDialogVisible,
      setIsVisible: setInviteUsersWarningDialogVisible,
      dueDate,
      delayDueDate,
      isGracePeriod,
    };
  }
)(observer(withTranslation(["Payments", "Common"])(InviteUsersWarningDialog)));

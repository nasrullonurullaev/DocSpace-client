// (c) Copyright Ascensio System SIA 2009-2024
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
import React from "react";
import { useTranslation } from "react-i18next";
import { observer, inject } from "mobx-react";

import {
  ModalDialog,
  ModalDialogType,
} from "@docspace/shared/components/modal-dialog";

import { Card } from "./sub-components/Card";

import { Container } from "./FillPDFDialog.styled";
import type {
  FillPDFDialogProps,
  InjectFillPDFDialogProps,
} from "./FillPDFDialog.types";

const FillPDFDialog = inject<TStore>(
  ({ dialogsStore, contextOptionsStore }) => {
    const { setFillPDFDialogData, setShareCollectSelector } = dialogsStore;
    const { gotoDocEditor } = contextOptionsStore;

    return { setFillPDFDialogData, gotoDocEditor, setShareCollectSelector };
  },
)(
  observer(
    ({
      visible,
      setFillPDFDialogData,
      gotoDocEditor,
      setShareCollectSelector,
      data,
    }: FillPDFDialogProps & InjectFillPDFDialogProps) => {
      const { t } = useTranslation(["FillPDFDialog"]);

      const onClose = () => {
        setFillPDFDialogData!(false, null);
      };

      const openEditorFill = () => {
        gotoDocEditor!(false, data);
        onClose();
      };

      const openSelector = () => {
        setShareCollectSelector(true, data);
        onClose();
      };

      return (
        <ModalDialog
          autoMaxHeight
          visible={visible}
          onClose={onClose}
          displayType={ModalDialogType.aside}
        >
          <ModalDialog.Header>
            {t("FillPDFDialog:FillPDFDialogTitle")}
          </ModalDialog.Header>
          <ModalDialog.Body>
            <Container>
              <Card
                title={t("FillPDFDialog:FillOutTitle")}
                description={t("FillPDFDialog:FillOutDescription")}
                buttonLabel={t("FillPDFDialog:FillOutButtonLabel")}
                onCick={openEditorFill}
              />
              <Card
                title={t("FillPDFDialog:ShareCollectTitle")}
                description={t("FillPDFDialog:ShareCollectDescription")}
                buttonLabel={t("FillPDFDialog:ShareCollectButtonLabel")}
                onCick={openSelector}
              />
            </Container>
          </ModalDialog.Body>
        </ModalDialog>
      );
    },
  ),
) as unknown as React.FC<FillPDFDialogProps>;

export default FillPDFDialog;

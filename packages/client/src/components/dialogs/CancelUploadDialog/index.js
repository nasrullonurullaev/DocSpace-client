import { useTranslation } from "react-i18next";
import ModalDialog from "@docspace/components/modal-dialog";
import Button from "@docspace/components/button";
import ModalDialogContainer from "../ModalDialogContainer";

const CancelUploadDialog = ({ visible, onClose, loading }) => {
  const { t } = useTranslation(["Settings", "Common"]);

  return (
    <ModalDialogContainer
      visible={visible}
      onClose={onClose}
      displayType="modal"
    >
      <ModalDialog.Header>{t("Common:Confirmation")}</ModalDialog.Header>
      <ModalDialog.Body>{t("Settings:WantToCancelUpload")}</ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          label={t("Common:Yes")}
          size="normal"
          scale
          primary={true}
          onClick={onClose}
          isLoading={loading}
        />
        <Button
          label={t("Common:No")}
          size="normal"
          scale
          onClick={onClose}
          isDisabled={loading}
        />
      </ModalDialog.Footer>
    </ModalDialogContainer>
  );
};

export default CancelUploadDialog;

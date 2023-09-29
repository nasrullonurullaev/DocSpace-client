import { useState } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components";

import ImportSection from "../../../sub-components/ImportSection";
import SaveCancelButtons from "@docspace/components/save-cancel-buttons";
import PeopleIcon from "PUBLIC_DIR/images/catalog.accounts.react.svg";
import UserIcon from "PUBLIC_DIR/images/catalog.user.react.svg";

const SectionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  .save-cancel-buttons {
    margin-top: 4px;
  }
`;

const FifthStep = ({
  t,
  incrementStep,
  decrementStep,
  toggles,
  setToggles,
}) => {
  const [isChecked, setIsChecked] = useState(true);

  const onChange = (e, name) => {
    const checked = e.target.checked;
    setToggles({ [name]: checked });
  };

  const users =
    t("Settings:Employees")[0].toUpperCase() + t("Settings:Employees").slice(1);

  return (
    <SectionsWrapper>
      <ImportSection
        isChecked={isChecked}
        onChange={() => setIsChecked((prev) => !prev)}
        sectionName={users}
        description={t("Settings:UsersSectionDescription")}
        exportSection={{ sectionName: users, workspace: "NextCloud" }}
        importSection={{
          sectionName: t("Common:Accounts"),
          workspace: "DocSpace",
          SectionIcon: PeopleIcon,
        }}
        isDisabled
      />
      <ImportSection
        isChecked={toggles.importPersonalFiles}
        onChange={(e) => onChange(e, "importPersonalFiles")}
        sectionName={t("Settings:PersonalFiles")}
        description={t("Settings:PersonalFilesDescription", {
          serviceName: "Nextcloud",
        })}
        exportSection={{
          sectionName: t("Settings:UsersFiles"),
          workspace: "NextCloud",
        }}
        importSection={{
          sectionName: t("Common:Accounts"),
          workspace: t("Settings:MyDocuments"),
          SectionIcon: UserIcon,
        }}
      />
      <ImportSection
        isChecked={toggles.importSharedFiles}
        onChange={(e) => onChange(e, "importSharedFiles")}
        sectionName={t("Settings:SharedFiles")}
        description={t("Settings:SharedFilesDescription", {
          serviceName: "Nextcloud",
        })}
        exportSection={{
          sectionName: t("Settings:SharedFiles"),
          workspace: "NextCloud",
        }}
        importSection={{
          sectionName: t("Settings:MyDocuments"),
          workspace: "DocSpace",
          SectionIcon: PeopleIcon,
        }}
      />

      <SaveCancelButtons
        className="save-cancel-buttons"
        onSaveClick={incrementStep}
        onCancelClick={decrementStep}
        saveButtonLabel={t("Settings:NextStep")}
        cancelButtonLabel={t("Common:Back")}
        displaySettings
        showReminder
      />
    </SectionsWrapper>
  );
};

export default inject(({ importAccountsStore }) => {
  const { toggles, setToggles } = importAccountsStore;

  return {
    toggles,
    setToggles,
  };
})(observer(FifthStep));

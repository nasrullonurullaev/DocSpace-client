import React from "react";
import { inject, observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import ToggleButton from "@docspace/components/toggle-button";
import HelpButton from "@docspace/components/help-button";
import Box from "@docspace/components/box";
import TextInput from "@docspace/components/text-input";
import FieldContainer from "@docspace/components/field-container";
import Textarea from "@docspace/components/textarea";

const FIELD_STYLE = { marginBottom: "0px" };

const GROUP_DN = "groupDN",
  GROUP_ATTRIBUTE = "groupAttribute",
  GROUP_NAME_ATTRIBUTE = "groupNameAttribute",
  USER_ATTRIBUTE = "userAttribute",
  GROUP_FILTER = "groupFilter";

const GroupMembership = (props) => {
  const {
    groupMembership,
    setIsGroupMembership,
    groupDN,
    userAttribute,
    groupFilter,
    groupAttribute,
    groupNameAttribute,
    setGroupDN,
    setUserAttribute,
    setGroupFilter,
    setGroupAttribute,
    setGroupNameAttribute,
  } = props;
  const { t } = useTranslation(["Ldap", "Common"]);

  const onChange = (e) => {
    const { value, name } = e.target;

    switch (name) {
      case GROUP_DN:
        setGroupDN(value);
        break;
      case USER_ATTRIBUTE:
        setUserAttribute(value);
        break;
      case GROUP_FILTER:
        setGroupFilter(value);
        break;
      case GROUP_NAME_ATTRIBUTE:
        setGroupNameAttribute(value);
        break;
      case GROUP_ATTRIBUTE:
        setGroupAttribute(value);
        break;
    }
  };

  return (
    <>
      <div className="group_membership-header">
        <ToggleButton
          className="toggle"
          isChecked={groupMembership}
          onChange={setIsGroupMembership}
          label={"GroupMembership"}
        />
        <HelpButton tooltipContent={"LdapGroupMembershipTooltip"} />
      </div>
      <Box className="group_membership-container">
        <FieldContainer
          isVertical
          style={FIELD_STYLE}
          errorMessage={t("Common:EmptyFieldError")}
          labelText={"GroupDN"}
          isRequired
          tooltipContent="GroupDNTooltip"
        >
          <TextInput
            className="field-input"
            onChange={onChange}
            name={GROUP_DN}
            value={groupDN}
            isDisabled={!groupMembership}
            scale
          />
        </FieldContainer>
        <FieldContainer
          isVertical
          style={FIELD_STYLE}
          errorMessage={t("Common:EmptyFieldError")}
          labelText={"UserAttribute"}
          isRequired
          tooltipContent="UserAttributeTooltip"
        >
          <TextInput
            className="field-input"
            onChange={onChange}
            name={USER_ATTRIBUTE}
            value={userAttribute}
            isDisabled={!groupMembership}
            scale
          />
        </FieldContainer>
        <FieldContainer
          style={FIELD_STYLE}
          isVertical
          errorMessage={t("Common:EmptyFieldError")}
          labelText={t("LdapGroupFilter")}
          tooltipContent={t("LdapGroupFilterTooltip")}
          className="ldap_group-filter"
          inlineHelpButton
          isRequired
        >
          <Textarea
            value={groupFilter}
            onChange={onChange}
            name={GROUP_FILTER}
            isDisabled={!groupMembership}
            heightTextArea={100}
          />
        </FieldContainer>
        <FieldContainer
          style={FIELD_STYLE}
          isVertical
          errorMessage={t("Common:EmptyFieldError")}
          labelText={"GroupNameAttribute"}
          isRequired
          tooltipContent="GroupNameAttributeTooltip"
        >
          <TextInput
            className="field-input"
            onChange={onChange}
            name={GROUP_NAME_ATTRIBUTE}
            isDisabled={!groupMembership}
            value={groupNameAttribute}
            scale
          />
        </FieldContainer>
        <FieldContainer
          isVertical
          errorMessage={t("Common:EmptyFieldError")}
          labelText={"GroupAttribute"}
          isRequired
          tooltipContent="GroupAttributeTooltip"
        >
          <TextInput
            className="field-input"
            onChange={onChange}
            name={GROUP_ATTRIBUTE}
            isDisabled={!groupMembership}
            value={groupAttribute}
            scale
          />
        </FieldContainer>
      </Box>
    </>
  );
};

export default inject(({ ldapStore }) => {
  const {
    groupMembership,
    setIsGroupMembership,
    groupDN,
    userAttribute,
    groupFilter,
    groupAttribute,
    groupNameAttribute,
    setGroupDN,
    setUserAttribute,
    setGroupFilter,
    setGroupAttribute,
    setGroupNameAttribute,
  } = ldapStore;

  return {
    groupMembership,
    setIsGroupMembership,
    groupDN,
    userAttribute,
    groupFilter,
    groupAttribute,
    groupNameAttribute,
    setGroupDN,
    setUserAttribute,
    setGroupFilter,
    setGroupAttribute,
    setGroupNameAttribute,
  };
})(observer(GroupMembership));

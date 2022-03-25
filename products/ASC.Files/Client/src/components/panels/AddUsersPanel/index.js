import React from "react";
import { inject, observer } from "mobx-react";
import PropTypes from "prop-types";
import Backdrop from "@appserver/components/backdrop";
import Heading from "@appserver/components/heading";
import Aside from "@appserver/components/aside";
import IconButton from "@appserver/components/icon-button";
import { ShareAccessRights } from "@appserver/common/constants";
import PeopleSelector from "people/PeopleSelector";
import { withTranslation } from "react-i18next";
import {
  StyledAddUsersPanelPanel,
  StyledContent,
  StyledHeaderContent,
  StyledBody,
} from "../StyledPanels";
import AccessComboBox from "../SharingPanel/AccessComboBox";
import Loaders from "@appserver/common/components/Loaders";
import withLoader from "../../../HOCs/withLoader";

class AddUsersPanelComponent extends React.Component {
  constructor(props) {
    super(props);

    const accessRight = props.isEncrypted
      ? ShareAccessRights.FullAccess
      : ShareAccessRights.ReadOnly;

    this.state = {
      showActionPanel: false,
      accessRight,
    };

    this.scrollRef = React.createRef();
  }

  onPlusClick = () =>
    this.setState({ showActionPanel: !this.state.showActionPanel });

  onArrowClick = () => this.props.onClose();

  onKeyPress = (event) => {
    if (event.key === "Esc" || event.key === "Escape") {
      this.props.onClose();
    }
  };

  onClosePanels = () => {
    this.props.onClose();
    this.props.onSharingPanelClose();
  };

  onPeopleSelect = (users) => {
    const { shareDataItems, setShareDataItems, onClose } = this.props;
    const items = shareDataItems;
    for (let item of users) {
      if (item.key) {
        item.id = item.key;
        item.groups = item.groups;
      }
      const currentItem = shareDataItems.find((x) => x.sharedTo.id === item.id);
      if (!currentItem) {
        const newItem = {
          access: this.state.accessRight,
          isLocked: false,
          isOwner: false,
          sharedTo: item,
        };
        items.push(newItem);
      }
    }

    setShareDataItems(items);
    onClose();
  };

  onOwnerSelect = (owner) => {
    const { setShareDataItems, shareDataItems, onClose } = this.props;
    const ownerItem = shareDataItems.find((x) => x.isOwner);
    ownerItem.sharedTo = owner[0];

    if (owner[0].key) {
      owner[0].id = owner[0].key;
    }

    setShareDataItems(shareDataItems);
    onClose();
  };

  componentDidMount() {
    const scroll = this.scrollRef.current.getElementsByClassName("scroll-body");
    setTimeout(() => scroll[1] && scroll[1].focus(), 2000);
    window.addEventListener("keyup", this.onKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.onKeyPress);
  }

  onAccessChange = (e) => {
    const accessRight = +e.currentTarget.dataset.access;
    this.setState({ accessRight });
  };

  render() {
    const {
      t,
      visible,
      groupsCaption,
      accessOptions,
      isMultiSelect,
      theme,
      shareDataItems,
    } = this.props;
    const { accessRight } = this.state;

    const selectedOptions = [];
    shareDataItems.forEach((item) => {
      const { sharedTo } = item;
      if (sharedTo.groups) {
        const groups = sharedTo.groups.map((group) => group.id);
        selectedOptions.push({ key: sharedTo.id, id: sharedTo.id, groups });
      }
    });

    const zIndex = 310;

    const embeddedComponent = isMultiSelect
      ? {
          embeddedComponent: (
            <AccessComboBox
              t={t}
              access={accessRight}
              directionX="right"
              onAccessChange={this.onAccessChange}
              accessOptions={accessOptions}
              arrowIconColor={theme.filesPanels.addUsers.arrowColor}
            />
          ),
        }
      : null;

    //console.log("AddUsersPanel render");
    return (
      <StyledAddUsersPanelPanel visible={visible}>
        <Backdrop
          onClick={this.onClosePanels}
          visible={visible}
          zIndex={zIndex}
          isAside={true}
        />
        <Aside className="header_aside-panel">
          <StyledContent>
            <StyledBody ref={this.scrollRef}>
              <PeopleSelector
                className="peopleSelector"
                role={isMultiSelect ? null : "user"}
                employeeStatus={1}
                displayType="aside"
                withoutAside
                isOpen={visible}
                isMultiSelect={isMultiSelect}
                onSelect={
                  isMultiSelect ? this.onPeopleSelect : this.onOwnerSelect
                }
                {...embeddedComponent}
                selectedOptions={selectedOptions}
                groupsCaption={groupsCaption}
                showCounter
                onArrowClick={this.onArrowClick}
                headerLabel={
                  isMultiSelect ? t("LinkText") : t("Translations:OwnerChange")
                }
                //onCancel={onClose}
              />
            </StyledBody>
          </StyledContent>
        </Aside>
      </StyledAddUsersPanelPanel>
    );
  }
}

AddUsersPanelComponent.propTypes = {
  visible: PropTypes.bool,
  onSharingPanelClose: PropTypes.func,
  onClose: PropTypes.func,
};

export default inject(({ auth }) => {
  return { theme: auth.settingsStore.theme };
})(
  observer(
    withTranslation(["SharingPanel", "Translations"])(
      withLoader(AddUsersPanelComponent)(<Loaders.DialogAsideLoader isPanel />)
    )
  )
);

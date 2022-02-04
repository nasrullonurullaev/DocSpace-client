import React from "react";
import { inject, observer } from "mobx-react";
import { isMobile } from "react-device-detect";

export default function withFileActions(WrappedFileItem) {
  class WithFileActions extends React.Component {
    constructor(props) {
      super(props);
    }

    onContentFileSelect = (checked, file) => {
      const { selectRowAction } = this.props;
      if (!file || file.id === -1) return;
      selectRowAction(checked, file);
    };

    fileContextClick = () => {
      const { onSelectItem, item } = this.props;
      const { id, isFolder } = item;

      id !== -1 && onSelectItem({ id, isFolder });
    };

    onHideContextMenu = () => {
      //this.props.setBufferSelection(null);
    };

    onDropZoneUpload = (files, uploadToFolder) => {
      const { t, dragging, setDragging, startUpload } = this.props;

      dragging && setDragging(false);
      startUpload(files, uploadToFolder, t);
    };

    onDrop = (items) => {
      const { fileExst, id } = this.props.item;

      if (!fileExst) {
        this.onDropZoneUpload(items, id);
      } else {
        this.onDropZoneUpload(items);
      }
    };

    onMouseDown = (e) => {
      const {
        draggable,
        setTooltipPosition,
        setStartDrag,
        isPrivacy,
        isTrashFolder,
        onSelectItem,
        item,
        setBufferSelection,
        isActive,
      } = this.props;

      const { id, isFolder, isThirdPartyFolder } = item;

      const notSelectable = e.target.classList.contains("not-selectable");
      const isFileName = e.target.classList.contains("item-file-name");

      if (
        isPrivacy ||
        isTrashFolder ||
        (!draggable && !isFileName && !isActive)
      )
        return e;

      if (
        window.innerWidth < 1025 ||
        notSelectable ||
        isMobile ||
        isThirdPartyFolder
      ) {
        return e;
      }

      // if (!draggable) {
      //   id !== -1 && onSelectItem({ id, isFolder });
      // }

      const mouseButton = e.which
        ? e.which !== 1
        : e.button
        ? e.button !== 0
        : false;
      const label = e.currentTarget.getAttribute("label");
      if (mouseButton || e.currentTarget.tagName !== "DIV" || label) {
        return e;
      }
      e.preventDefault();
      setTooltipPosition(e.pageX, e.pageY);
      !isFileName && setStartDrag(true);
      !isActive && setBufferSelection(null);
    };

    onMouseClick = (e) => {
      const { viewAs, isItemsSelected } = this.props;

      if (
        e.target.closest(".checkbox") ||
        e.target.tagName === "INPUT" ||
        e.target.tagName === "SPAN" ||
        e.target.tagName === "A" ||
        e.target.closest(".expandButton") ||
        e.target.closest(".badges") ||
        e.button !== 0 /* ||
        isItemsSelected */
      )
        return;

      if (viewAs === "tile") {
        if (e.target.closest(".edit-button") || e.target.tagName === "IMG")
          return;

        if (e.detail === 1) this.fileContextClick();
      } else {
        this.fileContextClick();
      }
    };
    onFilesClick = (e) => {
      const { item, openFileAction } = this.props;
      if ((e && e.target.tagName === "INPUT") || e.target.closest(".badges"))
        return;

      e.preventDefault();
      openFileAction(item);
    };

    render() {
      const {
        item,
        isTrashFolder,
        draggable,
        allowShareIn,
        isPrivacy,
        actionType,
        actionExtension,
        actionId,
        sectionWidth,
        checked,
        dragging,
        isFolder,
        isDesktop,
        personal,
        canWebEdit,
        canViewedDocs,
      } = this.props;
      const { fileExst, access, id } = item;

      const isEdit =
        actionType !== null && actionId === id && fileExst === actionExtension;

      const isDragging = isFolder && access < 2 && !isTrashFolder && !isPrivacy;

      let className = isDragging ? " droppable" : "";
      if (draggable) className += " draggable";

      let value = !item.isFolder ? `file_${id}` : `folder_${id}`;
      value += draggable ? "_draggable" : "";

      const isShareable = allowShareIn && item.canShare;

      const isMobileView = sectionWidth < 500;

      const displayShareButton = isMobileView
        ? "26px"
        : !isShareable
        ? "38px"
        : "96px";

      const showShare =
        !isShareable ||
        isEdit ||
        (isPrivacy && (!isDesktop || !fileExst)) ||
        (personal && !canWebEdit && !canViewedDocs)
          ? false
          : true;

      const checkedProps = isEdit || id <= 0 ? false : checked;

      return (
        <WrappedFileItem
          onContentFileSelect={this.onContentFileSelect}
          fileContextClick={this.fileContextClick}
          onDrop={this.onDrop}
          onMouseDown={this.onMouseDown}
          onFilesClick={this.onFilesClick}
          onMouseClick={this.onMouseClick}
          onHideContextMenu={this.onHideContextMenu}
          getClassName={this.getClassName}
          className={className}
          isDragging={isDragging}
          value={value}
          displayShareButton={displayShareButton}
          isPrivacy={isPrivacy}
          showShare={showShare}
          checkedProps={checkedProps}
          dragging={dragging}
          isEdit={isEdit}
          {...this.props}
        />
      );
    }
  }

  return inject(
    (
      {
        auth,
        filesActionsStore,
        dialogsStore,
        treeFoldersStore,
        //selectedFolderStore,
        filesStore,
        uploadDataStore,
        formatsStore,
        mediaViewerDataStore,
      },
      { item, t, history }
    ) => {
      const {
        selectRowAction,
        onSelectItem,
        setNewBadgeCount,
        openFileAction,
      } = filesActionsStore;
      const { setSharingPanelVisible } = dialogsStore;
      const {
        isPrivacyFolder,
        isRecycleBinFolder,
        //addExpandedKeys,
      } = treeFoldersStore;
      const {
        dragging,
        setDragging,
        selection,
        setTooltipPosition,
        setStartDrag,
        fileActionStore,
        isFileSelected,
        getFolderInfo,
        viewAs,
        bufferSelection,
        setBufferSelection,
        hotkeyCaret,
      } = filesStore;
      const { startUpload } = uploadDataStore;
      const { type, extension, id } = fileActionStore;
      const { docserviceStore } = formatsStore;

      const selectedItem = selection.find(
        (x) => x.id === item.id && x.fileExst === item.fileExst
      );

      const draggable =
        !isRecycleBinFolder && selectedItem && selectedItem.id !== id;

      const isFolder = selectedItem ? false : !item.isFolder ? false : true;

      const canWebEdit = docserviceStore.canWebEdit(item.fileExst);
      const canViewedDocs = docserviceStore.canViewedDocs(item.fileExst);

      const isActive =
        bufferSelection &&
        bufferSelection.id === item.id &&
        bufferSelection.fileExst === item.fileExst &&
        !selection.length; // need for select row item

      const showHotkeyBorder = hotkeyCaret?.id === item.id;

      return {
        t,
        item,
        selectRowAction,
        onSelectItem,
        setSharingPanelVisible,
        isPrivacy: isPrivacyFolder,
        dragging,
        setDragging,
        startUpload,
        draggable,
        setTooltipPosition,
        setStartDrag,
        history,
        isFolder,
        allowShareIn: filesStore.canShare,
        actionType: type,
        actionExtension: extension,
        actionId: id,
        checked: isFileSelected(item.id, item.parentId),
        //parentFolder: selectedFolderStore.parentId,
        canWebEdit,
        canViewedDocs,
        isTrashFolder: isRecycleBinFolder,
        //addExpandedKeys,
        getFolderInfo,
        viewAs,
        isDesktop: auth.settingsStore.isDesktopClient,
        personal: auth.settingsStore.personal,
        isItemsSelected: selection.length > 0,
        setNewBadgeCount,
        isActive,
        setBufferSelection,
        bufferSelection,
        showHotkeyBorder,
        openFileAction,
      };
    }
  )(observer(WithFileActions));
}

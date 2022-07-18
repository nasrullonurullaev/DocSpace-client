import React from "react";

import { FileAction } from "@appserver/common/constants";

import { Events } from "../../helpers/constants";

import CreateEvent from "./CreateEvent";
import RenameEvent from "./RenameEvent";

const GlobalEvents = () => {
  const [createDialogProps, setCreateDialogProps] = React.useState({
    visible: false,
    id: null,
    type: null,
    extension: null,
    title: "",
    templateId: null,
    fromTemplate: null,
    onClose: null,
  });

  const [renameDialogProps, setRenameDialogProps] = React.useState({
    visible: false,
    item: null,
    onClose: null,
  });

  const onCreate = React.useCallback((e) => {
    const { payload } = e;

    const visible = payload.id ? true : false;

    setCreateDialogProps({
      visible: visible,
      id: payload.id,
      type: FileAction.Create,
      extension: payload.extension,
      title: payload.title || null,
      templateId: payload.templateId || null,
      fromTemplate: payload.fromTemplate || null,
      onClose: () => {
        setCreateDialogProps({
          visible: false,
          id: null,
          type: null,
          extension: null,
          title: "",
          templateId: null,
          fromTemplate: null,
          onClose: null,
        });
      },
    });
  }, []);

  const onRename = React.useCallback((e) => {
    const visible = e.item ? true : false;

    setRenameDialogProps({
      visible: visible,
      type: FileAction.Rename,
      item: e.item,
      onClose: () => {
        setRenameDialogProps({
          visible: false,
          typ: null,
          item: null,
        });
      },
    });
  }, []);

  React.useEffect(() => {
    window.addEventListener(Events.CREATE, onCreate);
    window.addEventListener(Events.RENAME, onRename);

    return () => {
      window.removeEventListener(Events.CREATE, onCreate);
      window.removeEventListener(Events.RENAME, onRename);
    };
  }, [onRename, onCreate]);

  return [
    createDialogProps.visible && (
      <CreateEvent key={Events.CREATE} {...createDialogProps} />
    ),
    renameDialogProps.visible && (
      <RenameEvent key={Events.RENAME} {...renameDialogProps} />
    ),
  ];
};

export default React.memo(GlobalEvents);

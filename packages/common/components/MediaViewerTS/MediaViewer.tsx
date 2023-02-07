import { isMobileOnly } from "react-device-detect";
import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react'

import ImageViewer from "../MediaViewer/sub-components/image-viewer";

import { MediaViewerProps } from './MediaViewer.props';
import { FileStatus } from "@docspace/common/constants";
import { ButtonKeys, isNullOrUndefined, mapSupplied, mediaTypes, nearestValue } from "./helpers";

import InfoOutlineReactSvgUrl from "PUBLIC_DIR/images/info.outline.react.svg?url";
import CopyReactSvgUrl from "PUBLIC_DIR/images/copy.react.svg?url";
import DuplicateReactSvgUrl from "PUBLIC_DIR/images/duplicate.react.svg?url";
import DownloadReactSvgUrl from "PUBLIC_DIR/images/download.react.svg?url";
import RenameReactSvgUrl from "PUBLIC_DIR/images/rename.react.svg?url";
import TrashReactSvgUrl from "PUBLIC_DIR/images/trash.react.svg?url";
import MoveReactSvgUrl from "PUBLIC_DIR/images/duplicate.react.svg?url";



function MediaViewer({ playlistPos, ...props }: MediaViewerProps): JSX.Element {
    const ctrIsPressedRef = useRef<boolean>(false);

    const [title, setTitle] = useState<string>("")
    const [canSwipeImage, setCanSwipeImage] = useState<boolean>(true);
    const [fileUrl, setFileUrl] = useState<string>(() => {
        const { playlist, currentFileId, } = props
        const item = playlist.find(file => file.fileId.toString() === currentFileId.toString());
        return item?.src ?? ""
    });

    const [targetFile, setTargetFile] = useState(() => {
        const { files, currentFileId } = props
        return files.find((item) => item.id === currentFileId)
    })

    const [isFavorite, setIsFavorite] = useState<boolean>(() => {
        const { playlist } = props

        return (playlist[playlistPos].fileStatus & FileStatus.IsFavorite) ===
            FileStatus.IsFavorite;
    })



    useEffect(() => {
        const fileId = props.playlist[playlistPos]?.fileId;

        if (fileId !== undefined && props.currentFileId !== fileId) {
            props.onChangeUrl(fileId)
        }

    }, [props.playlist.length])


    useEffect(() => {
        const { playlist, files, setBufferSelection } = props;

        const currentFile = playlist[playlistPos];

        const currentFileId =
            playlist.length > 0
                ? playlist.find((file) => file.id === playlistPos)?.fileId
                : 0;

        const targetFile = files.find((item) => item.id === currentFileId);

        if (targetFile) setBufferSelection(targetFile);

        const { src, title } = currentFile;

        const ext = getFileExtension(title);

        if (ext === ".tiff" || ext === ".tif") {
            fetchAndSetTiffDataURL(src);
        }

        document.addEventListener("keydown", onKeydown, false);
        document.addEventListener("keyup", onKeyup, false);

        return () => {
            document.removeEventListener("keydown", onKeydown, false);
            document.removeEventListener("keyup", onKeyup, false);
            props.onClose();
        }
    }, [])


    useEffect(() => {

        const { playlist, currentFileId, onEmptyPlaylistError, files } = props

        let newPlaylistPos = currentFileId
            ? playlist.find((file) => file.fileId === currentFileId)?.id
            : 0;

        if (isNullOrUndefined(newPlaylistPos)) {
            newPlaylistPos = nearestValue(playlist, playlistPos)
        }


        const { src, title, fileId } = playlist[newPlaylistPos]
        const ext = getFileExtension(title);


        if (!src) return onEmptyPlaylistError()

        if (ext !== ".tif" && ext !== ".tiff" && src !== fileUrl) {
            setFileUrl(src)
        }

        if (ext === ".tiff" || ext === ".tif") {
            fetchAndSetTiffDataURL(src);
        }


        setTargetFile(files.find(file => file.id === fileId))
        setTitle(title);
        setIsFavorite((playlist[playlistPos].fileStatus & FileStatus.IsFavorite) ===
            FileStatus.IsFavorite)

    }, [props.playlist, props.currentFileId])



    const getContextModel = () => {
        const {
            t,
            onClickDownload,
            onClickRename,
            onClickDelete,
            onShowInfoPanel,
            onMoveAction,
            onCopyAction,
            onDuplicate
        } = props

        if (!targetFile) return []


        const desktopModel = [
            {
                key: "download",
                label: t("Common:Download"),
                icon: DownloadReactSvgUrl,
                onClick: () => onClickDownload(targetFile, t),
                disabled: false,
            },
            {
                key: "rename",
                label: t("Rename"),
                icon: RenameReactSvgUrl,
                onClick: () => onClickRename(targetFile),
                disabled: archiveRoom,
            },
            {
                key: "delete",
                label: t("Common:Delete"),
                icon: TrashReactSvgUrl,
                onClick: () => onClickDelete(targetFile, t),
                disabled: archiveRoom,
            },
        ];

        const model = [
            {
                id: "option_room-info",
                key: "room-info",
                label: t("Common:Info"),
                icon: InfoOutlineReactSvgUrl,
                onClick: () => {
                    return onShowInfoPanel(targetFile);
                },
                disabled: false,
            },
            {
                key: "download",
                label: t("Common:Download"),
                icon: DownloadReactSvgUrl,
                onClick: () => onClickDownload(targetFile, t),
                disabled: false,
            },
            {
                key: "move-to",
                label: t("MoveTo"),
                icon: MoveReactSvgUrl,
                onClick: onMoveAction,
                disabled: !targetFile.security.Move,
            },
            {
                id: "option_copy-to",
                key: "copy-to",
                label: t("Translations:Copy"),
                icon: CopyReactSvgUrl,
                onClick: onCopyAction,
                disabled: !targetFile.security.Copy,
            },
            {
                id: "option_create-copy",
                key: "copy",
                label: t("Common:Duplicate"),
                icon: DuplicateReactSvgUrl,
                onClick: () => onDuplicate(targetFile, t),
                disabled: !targetFile.security.Duplicate,
            },
            {
                key: "rename",
                label: t("Rename"),
                icon: RenameReactSvgUrl,
                onClick: () => onClickRename(targetFile),
                disabled: !targetFile.security.Rename,
            },

            {
                key: "separator0",
                isSeparator: true,
                disabled: !targetFile.security.Delete,
            },
            {
                key: "delete",
                label: t("Common:Delete"),
                icon: TrashReactSvgUrl,
                onClick: () => onClickDelete(targetFile, t),
                disabled: !targetFile.security.Delete,
            },
        ];

        return isMobileOnly
            ? model
            : isImage && !isMobileOnly
                ? desktopModel.filter((el) => el.key !== "download")
                : desktopModel;
    };


    const canImageView = useCallback((ext: string) => {
        const { extsImagePreviewed } = props;
        return extsImagePreviewed.indexOf(ext) != -1;
    }, [props.extsImagePreviewed]);

    const canPlay = useCallback((fileTitle: string) => {
        const { extsMediaPreviewed } = props;

        const ext =
            fileTitle[0] === "." ? fileTitle : getFileExtension(fileTitle);

        const supply = mapSupplied[ext];

        return (
            !!supply &&
            extsMediaPreviewed.indexOf(ext) != -1
        );
    }, [props.extsMediaPreviewed]);


    const getFileExtension = useCallback((fileTitle: string) => {
        if (!fileTitle) {
            return "";
        }
        fileTitle = fileTitle.trim();
        const posExt = fileTitle.lastIndexOf(".");
        return 0 <= posExt ? fileTitle.substring(posExt).trim().toLowerCase() : "";
    }, []);





    const prevMedia = () => {
        const { playlist, setBufferSelection, files, onChangeUrl } = props;

        let currentPlaylistPos = playlistPos - 1;

        if (currentPlaylistPos === -1) {
            return
        }

        if (currentPlaylistPos < 0)
            currentPlaylistPos = playlist.length - 1;

        const currentFileId = playlist[currentPlaylistPos].fileId;

        const targetFile = files.find(
            (item) => item.id === currentFileId
        );

        if (!isNullOrUndefined(targetFile))
            setBufferSelection(targetFile);

        const id = playlist[currentPlaylistPos].fileId;
        onChangeUrl(id);
    };

    const nextMedia = () => {
        const { setBufferSelection, playlist, files, onChangeUrl } = props;

        let currentPlaylistPos = (playlistPos + 1) % playlist.length;;

        if (currentPlaylistPos === 0) return;

        const currentFileId = playlist[currentPlaylistPos].fileId;

        const targetFile = files.find(
            (item) => item.id === currentFileId
        );

        if (!isNullOrUndefined(targetFile))
            setBufferSelection(targetFile);

        const id = playlist[currentPlaylistPos].fileId;
        onChangeUrl(id);
    };

    const onDelete = () => {
        const { playlist, onDelete } = props;

        let currentFileId =
            playlist.length > 0
                ? playlist.find((file) => file.id === playlistPos)?.fileId
                : 0;

        setCanSwipeImage(false);
        if (!isNullOrUndefined(currentFileId))
            onDelete(currentFileId);
    };


    const onDownload = () => {
        const { playlist, onDownload } = props;

        let currentFileId =
            playlist.length > 0
                ? playlist.find((file) => file.id === playlistPos)?.fileId
                : 0;
        if (!isNullOrUndefined(currentFileId))
            onDownload(currentFileId);
    };

    const onKeyup = useCallback((e: KeyboardEvent) => {
        if (ButtonKeys.ctr === e.keyCode) {
            ctrIsPressedRef.current = false;
        }
    }, []);


    const onKeydown = (e: KeyboardEvent) => {
        let isActionKey = false;
        for (let key in ButtonKeys) {
            if (ButtonKeys[key] === e.keyCode) {
                e.preventDefault();
                isActionKey = true;
            }
        }

        if (isActionKey) {
            switch (e.keyCode) {
                case ButtonKeys.leftArrow:
                    if (document.fullscreenElement) return;
                    canSwipeImage
                        ? ctrIsPressedRef.current
                            ? document.getElementsByClassName("iconContainer rotateLeft")
                                .length > 0 &&
                            (document
                                .getElementsByClassName("iconContainer rotateLeft")[0] as HTMLElement)
                                .click()
                            : prevMedia()
                        : null;
                    break;
                case ButtonKeys.rightArrow:
                    if (document.fullscreenElement) return;
                    canSwipeImage
                        ? ctrIsPressedRef.current
                            ? document.getElementsByClassName("iconContainer rotateRight")
                                .length > 0 &&
                            (document
                                .getElementsByClassName("iconContainer rotateRight")[0] as HTMLElement)
                                .click()
                            : nextMedia()
                        : null;
                    break;
                case ButtonKeys.space:
                    document.getElementsByClassName("video-play").length > 0 &&
                        (document.getElementsByClassName("video-play")[0] as HTMLElement).click();
                    break;
                case ButtonKeys.esc:
                    if (!props.deleteDialogVisible) props.onClose();
                    break;
                case ButtonKeys.upArrow:
                    document.getElementsByClassName("iconContainer zoomIn").length > 0 &&
                        (document.getElementsByClassName("iconContainer zoomIn")[0] as HTMLElement).click();
                    break;
                case ButtonKeys.downArrow:
                    document.getElementsByClassName("iconContainer zoomOut").length > 0 &&
                        (document.getElementsByClassName("iconContainer zoomOut")[0] as HTMLElement).click();
                    break;
                case ButtonKeys.ctr:
                    ctrIsPressedRef.current = true;
                    break;
                case ButtonKeys.s:
                    if (ctrIsPressedRef.current) onDownload();
                    break;
                case ButtonKeys.one:
                    ctrIsPressedRef.current &&
                        document.getElementsByClassName("iconContainer reset").length > 0 &&
                        (document.getElementsByClassName("iconContainer reset")[0] as HTMLElement).click();
                    break;
                case ButtonKeys.del:
                    onDelete();
                    break;

                default:
                    break;
            }
        }
    };

    const onClose = useCallback(() => {
        props.onClose();
    }, [props.onClose]);

    const fetchAndSetTiffDataURL = useCallback((src: string) => {
        if (!window.Tiff) return;

        const xhr = new XMLHttpRequest();
        xhr.responseType = "arraybuffer";

        xhr.open("GET", src);
        xhr.onload = function () {
            try {
                const tiff = new window.Tiff({ buffer: xhr.response });

                const dataUrl = tiff.toDataURL();

                setFileUrl(dataUrl)
            } catch (e) {
                console.log(e);
            }
        };
        xhr.send();
    }, []);

    const onSetSelectionFile = useCallback(() => {
        props.setBufferSelection(targetFile);
    }, [targetFile]);



    const ext = getFileExtension(title);
    const images = useMemo(() => [{ src: fileUrl, alt: "" }], [fileUrl])
    const audioIcon = useMemo(() => props.getIcon(96, ext), [ext]);
    const headerIcon = useMemo(() => props.getIcon(24, ext), [ext]);

    let isVideo = false;
    let isAudio = false;
    let canOpen = true;
    let isImage = false;

    const archiveRoom =
        props.archiveRoomsId === targetFile?.rootFolderId ||
        (!targetFile?.security?.Rename && !targetFile?.security?.Delete);

    if (canPlay(ext) && canImageView(ext)) {
        canOpen = false;
        props.onError?.();
    }

    if (canImageView(ext)) {
        isImage = true;
    } else {
        isImage = false;
        isVideo = mapSupplied[ext]
            ? mapSupplied[ext]?.type == mediaTypes.video
            : false;
        isAudio = mapSupplied[ext]
            ? mapSupplied[ext]?.type == mediaTypes.audio
            : false;
    }



    return (
        <>
            {canOpen && (
                <ImageViewer
                    userAccess={props.userAccess}
                    visible={props.visible}
                    title={title}
                    onClose={onClose}
                    images={images}
                    inactive={props.playlist.length <= 1}
                    playlist={props.playlist}
                    playlistPos={playlistPos}
                    onNextClick={nextMedia}
                    onSetSelectionFile={onSetSelectionFile}
                    contextModel={getContextModel}
                    onPrevClick={prevMedia}
                    onDeleteClick={onDelete}
                    isFavorite={isFavorite}
                    isImage={isImage}
                    isAudio={isAudio}
                    isVideo={isVideo}
                    isPreviewFile={props.isPreviewFile}
                    onDownloadClick={onDownload}
                    archiveRoom={archiveRoom}
                    errorTitle={props.t("Files:MediaError")}
                    headerIcon={headerIcon}
                    audioIcon={audioIcon}
                />
            )}
        </>
    )
}



export default MediaViewer 
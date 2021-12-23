/*
 *
 * (c) Copyright Ascensio System Limited 2010-2018
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU 
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html). 
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that 
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@onlyoffice.com
 *
 * The interactive user interfaces in modified source and object code versions of ONLYOFFICE must display 
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7 § 3(b) of the GNU GPL you must retain the original ONLYOFFICE logo which contains 
 * relevant author attributions when distributing the software. If the display of the logo in its graphic 
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by ONLYOFFICE" 
 * in every copy of the program you distribute. 
 * Pursuant to Section 7 § 3(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
*/


using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using ASC.Common;
using ASC.Core.Tenants;
using ASC.Files.Core;
using ASC.Files.Core.Resources;
using ASC.MessagingSystem;
using ASC.Web.Files.Helpers;
using ASC.Web.Files.Utils;

using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Primitives;

namespace ASC.Web.Files.Services.WCFService.FileOperations
{
    internal class FileDeleteOperationData<T> : FileOperationData<T>
    {
        public bool IgnoreException { get; }
        public bool Immediately { get; }
        public IDictionary<string, StringValues> Headers { get; }

        public FileDeleteOperationData(IEnumerable<object> folders, IEnumerable<object> files, Tenant tenant,
            bool holdResult = true, bool ignoreException = false, bool immediately = false, IDictionary<string, StringValues> headers = null)
            : this(folders.OfType<T>(), files.OfType<T>(), tenant, holdResult, ignoreException, immediately, headers)
        {
        }

        public FileDeleteOperationData(IEnumerable<T> folders, IEnumerable<T> files, Tenant tenant,
            bool holdResult = true, bool ignoreException = false, bool immediately = false, IDictionary<string, StringValues> headers = null)
            : base(folders, files, tenant, holdResult)
        {
            IgnoreException = ignoreException;
            Immediately = immediately;
            Headers = headers;
        }
    }

    [Transient]
    class FileDeleteOperation : ComposeFileOperation<FileDeleteOperationData<string>, FileDeleteOperationData<int>>
    {
        public FileDeleteOperation(IServiceProvider serviceProvider, FileOperation<FileDeleteOperationData<string>, string> f1, FileOperation<FileDeleteOperationData<int>, int> f2)
            : base(serviceProvider, f1, f2)
        {
        }

        public override FileOperationType OperationType
        {
            get { return FileOperationType.Delete; }
        }
    }

    class FileDeleteOperation<T> : FileOperation<FileDeleteOperationData<T>, T>
    {
        private int _trashId;
        private readonly bool _ignoreException;
        private readonly bool _immediately;
        private readonly IDictionary<string, StringValues> _headers;

        public override FileOperationType OperationType
        {
            get { return FileOperationType.Delete; }
        }


        public FileDeleteOperation(IServiceProvider serviceProvider, FileDeleteOperationData<T> fileOperationData)
            : base(serviceProvider, fileOperationData)
        {
            _ignoreException = fileOperationData.IgnoreException;
            _immediately = fileOperationData.Immediately;
            _headers = fileOperationData.Headers;
        }


        protected override void Do(IServiceScope scope)
        {
            var folderDao = scope.ServiceProvider.GetService<IFolderDao<int>>();
            _trashId = folderDao.GetFolderIDTrashAsync(true).Result;

            Folder<T> root = null;
            if (0 < Folders.Count)
            {
                root = FolderDao.GetRootFolderAsync(Folders[0]).Result;
            }
            else if (0 < Files.Count)
            {
                root = FolderDao.GetRootFolderByFileAsync(Files[0]).Result;
            }
            if (root != null)
            {
                Result += string.Format("folder_{0}{1}", root.ID, SPLIT_CHAR);
            }

            DeleteFiles(Files, scope);
            DeleteFolders(Folders, scope);
        }

        protected override async Task DoAsync(IServiceScope scope)
        {
            var folderDao = scope.ServiceProvider.GetService<IFolderDao<int>>();
            _trashId = folderDao.GetFolderIDTrashAsync(true).Result;

            Folder<T> root = null;
            if (0 < Folders.Count)
            {
                root = await FolderDao.GetRootFolderAsync(Folders[0]);
            }
            else if (0 < Files.Count)
            {
                root = await FolderDao.GetRootFolderByFileAsync(Files[0]);
            }
            if (root != null)
            {
                Result += string.Format("folder_{0}{1}", root.ID, SPLIT_CHAR);
            }

            await DeleteFilesAsync(Files, scope);
            await DeleteFoldersAsync(Folders, scope);
        }

        private void DeleteFolders(IEnumerable<T> folderIds, IServiceScope scope)
        {
            var scopeClass = scope.ServiceProvider.GetService<FileDeleteOperationScope>();
            var (fileMarker, filesMessageService) = scopeClass;
            foreach (var folderId in folderIds)
            {
                CancellationToken.ThrowIfCancellationRequested();

                var folder = FolderDao.GetFolderAsync(folderId).Result;
                T canCalculate = default;
                if (folder == null)
                {
                    Error = FilesCommonResource.ErrorMassage_FolderNotFound;
                }
                else if (folder.FolderType != FolderType.DEFAULT && folder.FolderType != FolderType.BUNCH)
                {
                    Error = FilesCommonResource.ErrorMassage_SecurityException_DeleteFolder;
                }
                else if (!_ignoreException && !FilesSecurity.CanDelete(folder))
                {
                    canCalculate = FolderDao.CanCalculateSubitems(folderId) ? default : folderId;

                    Error = FilesCommonResource.ErrorMassage_SecurityException_DeleteFolder;
                }
                else
                {
                    canCalculate = FolderDao.CanCalculateSubitems(folderId) ? default : folderId;

                    fileMarker.RemoveMarkAsNewForAll(folder);
                    if (folder.ProviderEntry && folder.ID.Equals(folder.RootFolderId))
                    {
                        if (ProviderDao != null)
                        {
                            ProviderDao.RemoveProviderInfoAsync(folder.ProviderId).Wait();
                            filesMessageService.Send(folder, _headers, MessageAction.ThirdPartyDeleted, folder.ID.ToString(), folder.ProviderKey);
                        }

                        ProcessedFolder(folderId);
                    }
                    else
                    {
                        var immediately = _immediately || !FolderDao.UseTrashForRemove(folder);
                        if (immediately && FolderDao.UseRecursiveOperation(folder.ID, default(T)))
                        {
                            DeleteFiles(FileDao.GetFilesAsync(folder.ID).Result, scope);
                            DeleteFolders(FolderDao.GetFoldersAsync(folder.ID).Select(f => f.ID).ToListAsync().Result, scope);

                            if (FolderDao.IsEmptyAsync(folder.ID).Result)
                            {
                                FolderDao.DeleteFolderAsync(folder.ID).Wait();
                                filesMessageService.Send(folder, _headers, MessageAction.FolderDeleted, folder.Title);

                                ProcessedFolder(folderId);
                            }
                        }
                        else
                        {
                            var files = FileDao.GetFilesAsync(folder.ID, new OrderBy(SortedByType.AZ, true), FilterType.FilesOnly, false, Guid.Empty, string.Empty, false, true).ToListAsync().Result;
                            if (!_ignoreException && WithError(scope, files, true, out var tmpError))
                            {
                                Error = tmpError;
                            }
                            else
                            {
                                if (immediately)
                                {
                                    FolderDao.DeleteFolderAsync(folder.ID).Wait();
                                    filesMessageService.Send(folder, _headers, MessageAction.FolderDeleted, folder.Title);
                                }
                                else
                                {
                                    FolderDao.MoveFolderAsync(folder.ID, _trashId, CancellationToken).Wait();
                                    filesMessageService.Send(folder, _headers, MessageAction.FolderMovedToTrash, folder.Title);
                                }

                                ProcessedFolder(folderId);
                            }
                        }
                    }
                }
                ProgressStep(canCalculate);
            }
        }

        private async Task DeleteFoldersAsync(IEnumerable<T> folderIds, IServiceScope scope)
        {
            var scopeClass = scope.ServiceProvider.GetService<FileDeleteOperationScope>();
            var (fileMarker, filesMessageService) = scopeClass;
            foreach (var folderId in folderIds)
            {
                CancellationToken.ThrowIfCancellationRequested();

                var folder = await FolderDao.GetFolderAsync(folderId);
                T canCalculate = default;
                if (folder == null)
                {
                    Error = FilesCommonResource.ErrorMassage_FolderNotFound;
                }
                else if (folder.FolderType != FolderType.DEFAULT && folder.FolderType != FolderType.BUNCH)
                {
                    Error = FilesCommonResource.ErrorMassage_SecurityException_DeleteFolder;
                }
                else if (!_ignoreException && !FilesSecurity.CanDelete(folder))
                {
                    canCalculate = FolderDao.CanCalculateSubitems(folderId) ? default : folderId;

                    Error = FilesCommonResource.ErrorMassage_SecurityException_DeleteFolder;
                }
                else
                {
                    canCalculate = FolderDao.CanCalculateSubitems(folderId) ? default : folderId;

                    fileMarker.RemoveMarkAsNewForAll(folder);
                    if (folder.ProviderEntry && folder.ID.Equals(folder.RootFolderId))
                    {
                        if (ProviderDao != null)
                        {
                            await ProviderDao.RemoveProviderInfoAsync(folder.ProviderId);
                            filesMessageService.Send(folder, _headers, MessageAction.ThirdPartyDeleted, folder.ID.ToString(), folder.ProviderKey);
                        }

                        ProcessedFolder(folderId);
                    }
                    else
                    {
                        var immediately = _immediately || !FolderDao.UseTrashForRemove(folder);
                        if (immediately && FolderDao.UseRecursiveOperation(folder.ID, default(T)))
                        {
                            var files = await FileDao.GetFilesAsync(folder.ID);
                            await DeleteFilesAsync(files, scope);

                            var folders = await FolderDao.GetFoldersAsync(folder.ID).ToListAsync();
                            await DeleteFoldersAsync(folders.Select(f => f.ID).ToList(), scope);

                            if (FolderDao.IsEmptyAsync(folder.ID).Result)
                            {
                                await FolderDao.DeleteFolderAsync(folder.ID);
                                filesMessageService.Send(folder, _headers, MessageAction.FolderDeleted, folder.Title);

                                ProcessedFolder(folderId);
                            }
                        }
                        else
                        {
                            var files = await FileDao.GetFilesAsync(folder.ID, new OrderBy(SortedByType.AZ, true), FilterType.FilesOnly, false, Guid.Empty, string.Empty, false, true).ToListAsync();
                            if (!_ignoreException && WithError(scope, files, true, out var tmpError))
                            {
                                Error = tmpError;
                            }
                            else
                            {
                                if (immediately)
                                {
                                    await FolderDao.DeleteFolderAsync(folder.ID);
                                    filesMessageService.Send(folder, _headers, MessageAction.FolderDeleted, folder.Title);
                                }
                                else
                                {
                                    await FolderDao.MoveFolderAsync(folder.ID, _trashId, CancellationToken);
                                    filesMessageService.Send(folder, _headers, MessageAction.FolderMovedToTrash, folder.Title);
                                }

                                ProcessedFolder(folderId);
                            }
                        }
                    }
                }
                ProgressStep(canCalculate);
            }
        }

        private void DeleteFiles(IEnumerable<T> fileIds, IServiceScope scope)
        {
            var scopeClass = scope.ServiceProvider.GetService<FileDeleteOperationScope>();
            var (fileMarker, filesMessageService) = scopeClass;
            foreach (var fileId in fileIds)
            {
                CancellationToken.ThrowIfCancellationRequested();

                var file = FileDao.GetFileAsync(fileId).Result;
                if (file == null)
                {
                    Error = FilesCommonResource.ErrorMassage_FileNotFound;
                }
                else if (!_ignoreException && WithError(scope, new[] { file }, false, out var tmpError))
                {
                    Error = tmpError;
                }
                else
                {
                    fileMarker.RemoveMarkAsNewForAll(file);
                    if (!_immediately && FileDao.UseTrashForRemove(file))
                    {
                        FileDao.MoveFileAsync(file.ID, _trashId).Wait();
                        filesMessageService.Send(file, _headers, MessageAction.FileMovedToTrash, file.Title);

                        if (file.ThumbnailStatus == Thumbnail.Waiting)
                        {
                            file.ThumbnailStatus = Thumbnail.NotRequired;
                            FileDao.SaveThumbnailAsync(file, null).Wait();
                        }
                    }
                    else
                    {
                        try
                        {
                            FileDao.DeleteFileAsync(file.ID).Wait();
                            filesMessageService.Send(file, _headers, MessageAction.FileDeleted, file.Title);
                        }
                        catch (Exception ex)
                        {
                            Error = ex.Message;
                            Logger.Error(Error, ex);
                        }
                    }
                    ProcessedFile(fileId);
                }
                ProgressStep(fileId: FolderDao.CanCalculateSubitems(fileId) ? default : fileId);
            }
        }

        private async Task DeleteFilesAsync(IEnumerable<T> fileIds, IServiceScope scope)
        {
            var scopeClass = scope.ServiceProvider.GetService<FileDeleteOperationScope>();
            var (fileMarker, filesMessageService) = scopeClass;
            foreach (var fileId in fileIds)
            {
                CancellationToken.ThrowIfCancellationRequested();

                var file = await FileDao.GetFileAsync(fileId);
                if (file == null)
                {
                    Error = FilesCommonResource.ErrorMassage_FileNotFound;
                }
                else if (!_ignoreException && WithError(scope, new[] { file }, false, out var tmpError))
                {
                    Error = tmpError;
                }
                else
                {
                    fileMarker.RemoveMarkAsNewForAll(file);
                    if (!_immediately && FileDao.UseTrashForRemove(file))
                    {
                        await FileDao.MoveFileAsync(file.ID, _trashId);
                        filesMessageService.Send(file, _headers, MessageAction.FileMovedToTrash, file.Title);

                        if (file.ThumbnailStatus == Thumbnail.Waiting)
                        {
                            file.ThumbnailStatus = Thumbnail.NotRequired;
                            FileDao.SaveThumbnailAsync(file, null).Wait();
                        }
                    }
                    else
                    {
                        try
                        {
                            await FileDao.DeleteFileAsync(file.ID);
                            filesMessageService.Send(file, _headers, MessageAction.FileDeleted, file.Title);
                        }
                        catch (Exception ex)
                        {
                            Error = ex.Message;
                            Logger.Error(Error, ex);
                        }
                    }
                    ProcessedFile(fileId);
                }
                ProgressStep(fileId: FolderDao.CanCalculateSubitems(fileId) ? default : fileId);
            }
        }

        private bool WithError(IServiceScope scope, IEnumerable<File<T>> files, bool folder, out string error)
        {
            var entryManager = scope.ServiceProvider.GetService<EntryManager>();
            var fileTracker = scope.ServiceProvider.GetService<FileTrackerHelper>();

            error = null;
            foreach (var file in files)
            {
                if (!FilesSecurity.CanDelete(file))
                {
                    error = FilesCommonResource.ErrorMassage_SecurityException_DeleteFile;
                    return true;
                }
                if (entryManager.FileLockedForMe(file.ID))
                {
                    error = FilesCommonResource.ErrorMassage_LockedFile;
                    return true;
                }
                if (fileTracker.IsEditing(file.ID))
                {
                    error = folder ? FilesCommonResource.ErrorMassage_SecurityException_DeleteEditingFolder : FilesCommonResource.ErrorMassage_SecurityException_DeleteEditingFile;
                    return true;
                }
            }
            return false;
        }
    }

    [Scope]
    public class FileDeleteOperationScope
    {
        private FileMarker FileMarker { get; }
        private FilesMessageService FilesMessageService { get; }

        public FileDeleteOperationScope(FileMarker fileMarker, FilesMessageService filesMessageService)
        {
            FileMarker = fileMarker;
            FilesMessageService = filesMessageService;
        }

        public void Deconstruct(out FileMarker fileMarker, out FilesMessageService filesMessageService)
        {
            fileMarker = FileMarker;
            filesMessageService = FilesMessageService;
        }
    }
}
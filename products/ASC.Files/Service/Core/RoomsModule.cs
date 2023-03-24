﻿// (c) Copyright Ascensio System SIA 2010-2022
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

using Constants = ASC.Feed.Constants;
using FeedModule = ASC.Feed.Aggregator.Modules.FeedModule;

namespace ASC.Files.Service.Core;

public class RoomsModule : FeedModule
{
    public const string RoomItem = Constants.RoomItem;
    public const string SharedRoomItem = Constants.SharedRoomItem;

    private readonly IFolderDao<int> _folderDao;
    private readonly UserManager _userManager;
    private readonly FileSecurity _fileSecurity;

    public RoomsModule(
        TenantManager tenantManager,
        UserManager userManager,
        WebItemSecurity webItemSecurity,
        FileSecurity fileSecurity,
        IDaoFactory daoFactory)
        : base(tenantManager, webItemSecurity)
    {
        _userManager = userManager;
        _fileSecurity = fileSecurity;
        _folderDao = daoFactory.GetFolderDao<int>();
    }

    public override string Name => Constants.RoomsModule;
    public override string Product => Constants.Documents;
    public override Guid ProductID => WebItemManager.DocumentsProductID;
    protected override string DbId => Constants.FilesDbId;

    public override async Task<bool> VisibleForAsync(Feed.Aggregator.Feed feed, object data, Guid userId)
    {
        if (!await _webItemSecurity.IsAvailableForUserAsync(ProductID, userId))
        {
            return false;
        }

        var folderWithShare = (FolderWithShare)data;
        var folder = folderWithShare.Folder;
        var shareRecord = folderWithShare.ShareRecord;

        bool targetCond;
        if (feed.Target != null)
        {
            if (shareRecord != null && shareRecord.Owner == userId)
            {
                return false;
            }

            var owner = (Guid)feed.Target;
            var groupUsers = (await _userManager.GetUsersByGroupAsync(owner)).Select(x => x.Id).ToList();
            if (groupUsers.Count == 0)
            {
                groupUsers.Add(owner);
            }

            targetCond = groupUsers.Contains(userId);
        }
        else
        {
            targetCond = true;
        }

        return targetCond && _fileSecurity.CanReadAsync(folder, userId).Result;
    }

    public override async Task<IEnumerable<Tuple<Feed.Aggregator.Feed, object>>> GetFeeds(FeedFilter filter)
    {
        var rooms = await _folderDao.GetFeedsForRoomsAsync(filter.Tenant, filter.Time.From, filter.Time.To).ToListAsync();

        return rooms.Select(f => new Tuple<Feed.Aggregator.Feed, object>(ToFeed(f), f));
    }

    public override async Task<IEnumerable<int>> GetTenantsWithFeeds(DateTime fromTime)
    {
        return await _folderDao.GetTenantsWithRoomsFeedsAsync(fromTime).ToListAsync();
    }

    private Feed.Aggregator.Feed ToFeed(FolderWithShare folderWithSecurity)
    {
        var folder = folderWithSecurity.Folder;
        var shareRecord = folderWithSecurity.ShareRecord;

        if (shareRecord != null)
        {
            var feed = new Feed.Aggregator.Feed(shareRecord.Owner, shareRecord.TimeStamp)
            {
                Item = SharedRoomItem,
                ItemId = string.Format("{0}_{1}_{2}", folder.Id, shareRecord.Subject, shareRecord.TimeStamp.Ticks),
                Product = Product,
                Module = Name,
                Title = folder.Title,
                ExtraLocationTitle = FilesUCResource.VirtualRooms,
                ExtraLocation = folder.ParentId.ToString(),
                Keywords = folder.Title,
                AdditionalInfo = ((int)folder.FolderType).ToString(),
                AdditionalInfo2 = ((int)shareRecord.Share).ToString(),
                AdditionalInfo3 = ((int)shareRecord.SubjectType).ToString(),
                AdditionalInfo4 = folder.Private ? "private" : null,
                Target = shareRecord.Subject,
                GroupId = GetGroupId(SharedRoomItem, shareRecord.Owner, folder.ParentId.ToString())
            };

            return feed;
        }

        return new Feed.Aggregator.Feed(folder.CreateBy, folder.CreateOn)
        {
            Item = RoomItem,
            ItemId = folder.Id.ToString(),
            Product = Product,
            Module = Name,
            Title = folder.Title,
            ExtraLocationTitle = FilesUCResource.VirtualRooms,
            ExtraLocation = folder.ParentId.ToString(),
            Keywords = folder.Title,
            AdditionalInfo = ((int)folder.FolderType).ToString(),
            AdditionalInfo4 = folder.Private ? "private" : null,
            GroupId = GetGroupId(RoomItem, folder.CreateBy, folder.ParentId.ToString())
        };
    }
}
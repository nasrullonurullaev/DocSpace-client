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

using ASC.Migration.Core.Resources;

namespace ASC.Api.Migration;

[Scope]
[DefaultRoute]
[ApiController]
public class MigrationController : ControllerBase
{
    private const string MigrationCacheKey = "ASC.Migration.Ongoing";
    private readonly CoreBaseSettings _coreBaseSettings;
    private readonly UserManager _userManager;
    private readonly AuthContext _authContext;
    private readonly TempPath _tempPath;
    private readonly StudioNotifyService _studioNotifyService;
    private readonly ICache _cache;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly MigrationCore _migrationCore;

    public MigrationController(
        CoreBaseSettings coreBaseSettings,
        UserManager userManager,
        AuthContext authContext,
        TempPath tempPath,
        StudioNotifyService studioNotifyService,
        ICache cache,
        IHttpContextAccessor httpContextAccessor,
        MigrationCore migrationCore)
    {
        _coreBaseSettings = coreBaseSettings;
        _userManager = userManager;
        _authContext = authContext;
        _tempPath = tempPath;
        _studioNotifyService = studioNotifyService;
        _cache = cache;
        _httpContextAccessor = httpContextAccessor;
        _migrationCore = migrationCore;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    [HttpGet("backuptmp")]
    public async Task<string> GetTmpFolderAsync()
    {
        if (!_coreBaseSettings.Standalone || !await _userManager.IsDocSpaceAdminAsync(_authContext.CurrentAccount.ID))
        {
            throw new SecurityException(Resource.ErrorAccessDenied);
        }

        var tempFolder = Path.Combine(_tempPath.GetTempPath(), "migration", DateTime.Now.ToString("dd.MM.yyyy_HH_mm"));

        if (!Directory.Exists(tempFolder))
        {
            Directory.CreateDirectory(tempFolder);
        }
        return tempFolder;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    [HttpGet("list")]
    public async Task<string[]> ListAsync()
    {
        if (!_coreBaseSettings.Standalone || !await _userManager.IsDocSpaceAdminAsync(_authContext.CurrentAccount.ID))
        {
            throw new SecurityException(Resource.ErrorAccessDenied);
        }

        return _migrationCore.GetAvailableMigrations();
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="migratorName"></param>
    /// <param name="path"></param>
    [HttpPost("init/{migratorName}")]
    public async Task UploadAndInitAsync(string migratorName, string path)
    {
        if (!_coreBaseSettings.Standalone || !await _userManager.IsDocSpaceAdminAsync(_authContext.CurrentAccount.ID))
        {
            throw new SecurityException(Resource.ErrorAccessDenied);
        }

        if (GetOngoingMigration() != null)
        {
            throw new Exception(MigrationResource.MigrationUploadException);
        }

        var migrator = _migrationCore.GetMigrator(migratorName);
        if (migrator == null)
        {
            throw new ItemNotFoundException(MigrationResource.MigrationNotFoundException);
        }

        var cts = new CancellationTokenSource();
        try
        {
            migrator.Init(path, cts.Token);
        }
        catch (Exception ex)
        {
            throw new Exception(string.Format(MigrationResource.MigrationUploadException, migratorName), ex);
        }

        var ongoingMigration = new OngoingMigration { Migration = migrator, CancelTokenSource = cts };
        StoreOngoingMigration(ongoingMigration);

        ongoingMigration.ParseTask = Task.Run(migrator.Parse);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    [HttpGet("status")]
    public async Task<object> Status()
    {
        if (!_coreBaseSettings.Standalone || !await _userManager.IsDocSpaceAdminAsync(_authContext.CurrentAccount.ID))
        {
            throw new SecurityException(Resource.ErrorAccessDenied);
        }

        var ongoingMigration = GetOngoingMigration();
        if (ongoingMigration == null)
        {
            return null;
        }

        if (ongoingMigration.CancelTokenSource.IsCancellationRequested == true)
        {
            var migratorName = ongoingMigration.Migration.Meta.Name;
            return migratorName;
        }

        var result = new MigrationStatus()
        {
            ParseResult = ongoingMigration.ParseTask.IsCompleted ? await ongoingMigration.ParseTask : null,
            MigrationEnded = ongoingMigration.MigrationEnded,
            Progress = ongoingMigration.Migration.GetProgress(),
            ProgressStatus = ongoingMigration.Migration.GetProgressStatus()
        };

        return result;
    }

    /// <summary>
    /// 
    /// </summary>
    [HttpPost("cancel")]
    public async Task CancelAsync()
    {
        if (!_coreBaseSettings.Standalone || !await _userManager.IsDocSpaceAdminAsync(_authContext.CurrentAccount.ID))
        {
            throw new SecurityException(Resource.ErrorAccessDenied);
        }

        var ongoingMigration = GetOngoingMigration();
        if (ongoingMigration == null)
        {
            throw new Exception(MigrationResource.MigrationProgressException);
        }
        ongoingMigration.CancelTokenSource.Cancel();
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="info"></param>
    [HttpPost("migrate")]
    public async Task MigrateAsync(MigrationApiInfo info)
    {
        if (!_coreBaseSettings.Standalone || !await _userManager.IsDocSpaceAdminAsync(_authContext.CurrentAccount.ID))
        {
            throw new SecurityException(Resource.ErrorAccessDenied);
        }

        var ongoingMigration = GetOngoingMigration();
        if (ongoingMigration == null)
        {
            throw new Exception(MigrationResource.MigrationProgressException);
        }
        else if (!ongoingMigration.ParseTask.IsCompleted)
        {
            throw new Exception(MigrationResource.MigrationStartException);
        }

        ongoingMigration.MigrationTask = ongoingMigration.Migration.Migrate(info);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    [HttpGet("logs")]
    public async Task LogsAsync()
    {
        if (!_coreBaseSettings.Standalone || !await _userManager.IsDocSpaceAdminAsync(_authContext.CurrentAccount.ID))
        {
            throw new SecurityException(Resource.ErrorAccessDenied);
        }

        var ongoingMigration = GetOngoingMigration();
        if (ongoingMigration == null)
        {
            throw new Exception(MigrationResource.MigrationProgressException);
        }

        _httpContextAccessor.HttpContext.Response.Headers.Add("Content-Disposition", ContentDispositionUtil.GetHeaderValue("migration.log"));
        _httpContextAccessor.HttpContext.Response.ContentType = "text/plain; charset=UTF-8";
        await ongoingMigration.Migration.GetLogs().CopyToAsync(_httpContextAccessor.HttpContext.Response.Body);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="isSendWelcomeEmail"></param>
    [HttpPost("finish")]
    public async Task FinishAsync(bool isSendWelcomeEmail)
    {
        if (!_coreBaseSettings.Standalone || !await _userManager.IsDocSpaceAdminAsync(_authContext.CurrentAccount.ID))
        {
            throw new SecurityException(Resource.ErrorAccessDenied);
        }

        if (isSendWelcomeEmail)
        {
            var ongoingMigration = GetOngoingMigration();
            if (ongoingMigration == null)
            {
                throw new Exception(MigrationResource.MigrationProgressException);
            }
            var guidUsers = ongoingMigration.Migration.GetGuidImportedUsers();
            foreach (var gu in guidUsers)
            {
                var u = await _userManager.GetUsersAsync(gu);
                await _studioNotifyService.UserInfoActivationAsync(u);
            }
        }
        ClearCache();
    }

    // ToDo: Use ASCCache
    private void StoreOngoingMigration(OngoingMigration migration)
    {
        _cache.Insert(MigrationCacheKey, migration, TimeSpan.FromDays(1));
    }

    private OngoingMigration GetOngoingMigration()
    {
        return _cache.Get<OngoingMigration>(MigrationCacheKey);
    }

    private void ClearCache()
    {
        _cache.Remove(MigrationCacheKey);
    }

    private void ClearMigration(CacheEntryRemovedArguments arguments)
    {
        if (typeof(OngoingMigration).IsAssignableFrom(arguments.CacheItem.Value.GetType()))
        {
            var ongoingMigration = (OngoingMigration)arguments.CacheItem.Value;
            ongoingMigration.Migration.Dispose();
        }
    }
}

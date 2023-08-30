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

namespace ASC.Migration.Core;

[Scope]
public class MigrationLogger : IDisposable
{
    private readonly ILogger<MigrationLogger> _logger;
    private string _migrationLogPath;
    private Stream _migration;
    private StreamWriter _migrationLog;
    private readonly StorageFactory _storageFactory;
    private readonly TenantManager _tenantManager;

    public MigrationLogger(ILogger<MigrationLogger> logger, StorageFactory storageFactory, TenantManager tenantManager)
    {
        _logger = logger;
        _storageFactory = storageFactory;
        _tenantManager = tenantManager;
    }

    public void Init(string logName = null)
    {
        _migrationLogPath = GetTmpFilePathAsync(logName).Result;
        _migration = new FileStream(_migrationLogPath, FileMode.OpenOrCreate, FileAccess.ReadWrite, System.IO.FileShare.ReadWrite);
        _migrationLog = new StreamWriter(_migration);
    }

    public async Task<string> GetTmpFilePathAsync(string logName)
    {
        var discStore = await _storageFactory.GetStorageAsync(await _tenantManager.GetCurrentTenantIdAsync(), "migration_log", (IQuotaController)null) as DiscDataStore;
        var folder = discStore.GetPhysicalPath("", "");

        if (!Directory.Exists(folder))
        {
            Directory.CreateDirectory(folder);
        }

        return Path.Combine(folder, logName ?? Path.GetRandomFileName());
    }

    public void Log(string msg, Exception exception = null)
    {
        try
        {
            if (exception != null)
            {
                _logger.WarningWithException(msg, exception);
            }
            else
            {
                _logger.Information(msg);
            }
            _migrationLog.WriteLine($"{DateTime.Now.ToString("s")}: {msg}");
            if (exception != null)
            {
                _migrationLog.WriteLine($"{exception.Message}");
            }
            _migrationLog.Flush();
        }
        catch { }
    }

    public void Dispose()
    {
        try
        {
            _migrationLog.Dispose();
        }
        catch { }
    }

    public Stream GetStream()
    {
        _migration.Position = 0;
        return _migration;
    }
    public string GetLogName()
    {
        return Path.GetFileName(_migrationLogPath);
    }
}

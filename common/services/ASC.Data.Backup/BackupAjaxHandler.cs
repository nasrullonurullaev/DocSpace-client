﻿using System;
using System.Collections.Generic;
using System.Linq;

using ASC.Common;
using ASC.Core;
using ASC.Core.Billing;
using ASC.Core.Common.Configuration;
using ASC.Core.Common.Contracts;
using ASC.Core.Users;
using ASC.MessagingSystem;
using ASC.Notify.Cron;
using ASC.Web.Core.PublicResources;
using ASC.Web.Studio.Core;
using ASC.Web.Studio.Utility;

namespace ASC.Data.Backup
{
    public class BackupAjaxHandler
    {

        private TenantManager TenantManager { get; }
        private MessageService MessageService { get; }
        private CoreBaseSettings CoreBaseSettings { get; }
        private CoreConfiguration CoreConfiguration { get; }
        private PermissionContext PermissionContext { get; }
        private SecurityContext SecurityContext { get; }
        private UserManager UserManager { get; }
        private TenantExtra TenantExtra { get; }
        private BackupHelper BackupHelper { get; }
        private ConsumerFactory ConsumerFactory { get; }
        private BackupServiceClient BackupServiceClient { get; }

        #region backup

        public BackupAjaxHandler(BackupServiceClient backupServiceClient, TenantManager tenantManager, MessageService messageService, CoreBaseSettings coreBaseSettings, CoreConfiguration coreConfiguration, PermissionContext permissionContext, SecurityContext securityContext, UserManager userManager, TenantExtra tenantExtra, BackupHelper backupHelper, ConsumerFactory consumerFactory)
        {
            TenantManager = tenantManager;
            MessageService = messageService;
            CoreBaseSettings = coreBaseSettings;
            CoreConfiguration = coreConfiguration;
            PermissionContext = permissionContext;
            SecurityContext = securityContext;
            UserManager = userManager;
            TenantExtra = tenantExtra;
            BackupHelper = backupHelper;
            ConsumerFactory = consumerFactory;
            BackupServiceClient = backupServiceClient;
        }

        public BackupProgress StartBackup(BackupStorageType storageType, Dictionary<string, string> storageParams, bool backupMail)
        {

            DemandPermissionsBackup();
            DemandSize();

            var backupRequest = new StartBackupRequest
            {
                TenantId = GetCurrentTenantId(),
                UserId = SecurityContext.CurrentAccount.ID.ToString(),
                BackupMail = backupMail,
                StorageType = (int)storageType
            };
            backupRequest.StorageParams.Add(storageParams);
            switch (storageType)
            {
                case BackupStorageType.ThridpartyDocuments:
                case BackupStorageType.Documents:
                    backupRequest.StorageBasePath = storageParams["folderId"];
                    break;
                case BackupStorageType.Local:
                    if (!CoreBaseSettings.Standalone) throw new Exception("Access denied");
                    backupRequest.StorageBasePath = storageParams["filePath"];
                    break;
            }

            MessageService.Send(MessageAction.StartBackupSetting);

            return BackupServiceClient.StartBackup(backupRequest);
        }

        public BackupProgress GetBackupProgress()
        {
            DemandPermissionsBackup();

            return BackupServiceClient.GetBackupProgress(GetCurrentTenantId());
        }

        public void DeleteBackup(Guid id)
        {
            DemandPermissionsBackup();

            BackupServiceClient.DeleteBackup(id);
        }

        public void DeleteAllBackups()
        {
            DemandPermissionsBackup();

            BackupServiceClient.DeleteAllBackups(GetCurrentTenantId());
        }

        public List<BackupHistoryRecord> GetBackupHistory()
        {
            DemandPermissionsBackup();
            return BackupServiceClient.GetBackupHistory(GetCurrentTenantId());
        }

        public void CreateSchedule(BackupStorageType storageType, Dictionary<string, string> storageParams, int backupsStored, CronParams cronParams, bool backupMail)
        {
            DemandPermissionsBackup();
            DemandSize();

            if (!SetupInfo.IsVisibleSettings("AutoBackup"))
                throw new InvalidOperationException(Resource.ErrorNotAllowedOption);

            ValidateCronSettings(cronParams);

            var scheduleRequest = new CreateScheduleRequest
            {
                TenantId = TenantManager.GetCurrentTenant().TenantId,
                BackupMail = backupMail,
                Cron = cronParams.ToString(),
                NumberOfBackupsStored = backupsStored,
                StorageType = (int)storageType
            };
            scheduleRequest.StorageParams.Add(storageParams);
            switch (storageType)
            {
                case BackupStorageType.ThridpartyDocuments:
                case BackupStorageType.Documents:
                    scheduleRequest.StorageBasePath = storageParams["folderId"];
                    break;
                case BackupStorageType.Local:
                    if (!CoreBaseSettings.Standalone) throw new Exception("Access denied");
                    scheduleRequest.StorageBasePath = storageParams["filePath"];
                    break;
            }

            BackupServiceClient.CreateSchedule(scheduleRequest);
        }

        public Schedule GetSchedule()
        {
            DemandPermissionsBackup();

            ScheduleResponse response;

            response = BackupServiceClient.GetSchedule(GetCurrentTenantId());
            if (response == null)
            {
                return null;
            }

            var schedule = new Schedule
            {
                StorageType = (BackupStorageType)response.StorageType,
                StorageParams = response.StorageParams.ToDictionary(r => r.Key, r => r.Value) ?? new Dictionary<string, string>(),
                CronParams = new CronParams(response.Cron),
                BackupMail = response.BackupMail,
                BackupsStored = response.NumberOfBackupsStored,
                LastBackupTime = response.LastBackupTime.ToDateTime()
            };

            if ((BackupStorageType)response.StorageType == BackupStorageType.CustomCloud)
            {
                var amazonSettings = CoreConfiguration.GetSection<AmazonS3Settings>();

                var consumer = ConsumerFactory.GetByKey<DataStoreConsumer>("S3");
                if (!consumer.IsSet)
                {
                    consumer["acesskey"] = amazonSettings.AccessKeyId;
                    consumer["secretaccesskey"] = amazonSettings.SecretAccessKey;

                    consumer["bucket"] = amazonSettings.Bucket;
                    consumer["region"] = amazonSettings.Region;
                }

                schedule.StorageType = BackupStorageType.ThirdPartyConsumer;
                schedule.StorageParams = consumer.AdditionalKeys.ToDictionary(r => r, r => consumer[r]);
                schedule.StorageParams.Add("module", "S3");

                var Schedule = new CreateScheduleRequest
                {
                    TenantId = TenantManager.GetCurrentTenant().TenantId,
                    BackupMail = schedule.BackupMail,
                    Cron = schedule.CronParams.ToString(),
                    NumberOfBackupsStored = schedule.BackupsStored,
                    StorageType = (int)schedule.StorageType
                };
                Schedule.StorageParams.Add(schedule.StorageParams);
                BackupServiceClient.CreateSchedule(Schedule);

            }
            else if ((BackupStorageType)response.StorageType != BackupStorageType.ThirdPartyConsumer)
            {
                schedule.StorageParams["folderId"] = response.StorageBasePath;
            }

            return schedule;
        }

        public void DeleteSchedule()
        {
            DemandPermissionsBackup();

            BackupServiceClient.DeleteSchedule(GetCurrentTenantId());

        }

        private void DemandPermissionsBackup()
        {
            PermissionContext.DemandPermissions(SecutiryConstants.EditPortalSettings);

            if (!SetupInfo.IsVisibleSettings(ManagementType.Backup.ToString()))
                throw new BillingException(Resource.ErrorNotAllowedOption, "Backup");
        }

        #endregion

        #region restore

        public BackupProgress StartRestore(string backupId, BackupStorageType storageType, Dictionary<string, string> storageParams, bool notify)
        {
            DemandPermissionsRestore();

            var restoreRequest = new StartRestoreRequest
            {
                TenantId = GetCurrentTenantId(),
                NotifyAfterCompletion = notify
            };
            restoreRequest.StorageParams.Add(storageParams);
            if (Guid.TryParse(backupId, out var guidBackupId))
            {
                restoreRequest.BackupId = guidBackupId.ToString();
            }
            else
            {
                restoreRequest.StorageType = (int)storageType;
                restoreRequest.FilePathOrId = storageParams["filePath"];
            }
            return BackupServiceClient.StartRestore(restoreRequest);
        }

        public BackupProgress GetRestoreProgress()
        {
            BackupProgress result;

            var tenant = TenantManager.GetCurrentTenant();
            result = BackupServiceClient.GetRestoreProgress(tenant.TenantId);

            return result;
        }

        private void DemandPermissionsRestore()
        {
            PermissionContext.DemandPermissions(SecutiryConstants.EditPortalSettings);

            if (!SetupInfo.IsVisibleSettings("Restore"))
                throw new BillingException(Resource.ErrorNotAllowedOption, "Restore");
        }

        #endregion

        #region transfer

        public BackupProgress StartTransfer(string targetRegion, bool notifyUsers, bool transferMail)
        {
            DemandPermissionsTransfer();
            DemandSize();

            MessageService.Send(MessageAction.StartTransferSetting);
            return BackupServiceClient.StartTransfer(
                new StartTransferRequest
                {
                    TenantId = GetCurrentTenantId(),
                    TargetRegion = targetRegion,
                    BackupMail = transferMail,
                    NotifyUsers = notifyUsers
                });

        }

        public BackupProgress GetTransferProgress()
        {
            return BackupServiceClient.GetTransferProgress(GetCurrentTenantId());
        }

        private void DemandPermissionsTransfer()
        {
            PermissionContext.DemandPermissions(SecutiryConstants.EditPortalSettings);

            var currentUser = UserManager.GetUsers(SecurityContext.CurrentAccount.ID);
            if (!SetupInfo.IsVisibleSettings(ManagementType.Migration.ToString())
                || !currentUser.IsOwner(TenantManager.GetCurrentTenant())
                || !SetupInfo.IsSecretEmail(currentUser.Email) && !TenantExtra.GetTenantQuota().HasMigration)
                throw new InvalidOperationException(Resource.ErrorNotAllowedOption);
        }

        #endregion

        public string GetTmpFolder()
        {
            return BackupServiceClient.GetTmpFolder();
        }

        private void DemandSize()
        {
            if (BackupHelper.ExceedsMaxAvailableSize(TenantManager.GetCurrentTenant().TenantId))
                throw new InvalidOperationException(string.Format(UserControlsCommonResource.BackupSpaceExceed,
                    FileSizeComment.FilesSizeToString(BackupHelper.AvailableZipSize),
                    "",
                    ""));
        }

        private static void ValidateCronSettings(CronParams cronParams)
        {
            new CronExpression(cronParams.ToString());
        }

        private int GetCurrentTenantId()
        {
            return TenantManager.GetCurrentTenant().TenantId;
        }

        public class Schedule
        {
            public BackupStorageType StorageType { get; set; }
            public Dictionary<string, string> StorageParams { get; set; }
            public CronParams CronParams { get; set; }
            public bool BackupMail { get; set; }
            public int BackupsStored { get; set; }
            public DateTime LastBackupTime { get; set; }
        }

        public class CronParams
        {
            public BackupPeriod Period { get; set; }
            public int Hour { get; set; }
            public int Day { get; set; }

            public CronParams()
            {
            }

            public CronParams(string cronString)
            {
                var tokens = cronString.Split(' ');
                Hour = Convert.ToInt32(tokens[2]);
                if (tokens[3] != "?")
                {
                    Period = BackupPeriod.EveryMonth;
                    Day = Convert.ToInt32(tokens[3]);
                }
                else if (tokens[5] != "*")
                {
                    Period = BackupPeriod.EveryWeek;
                    Day = Convert.ToInt32(tokens[5]);
                }
                else
                {
                    Period = BackupPeriod.EveryDay;
                }
            }

            public override string ToString()
            {
                return Period switch
                {
                    BackupPeriod.EveryDay => string.Format("0 0 {0} ? * *", Hour),
                    BackupPeriod.EveryMonth => string.Format("0 0 {0} {1} * ?", Hour, Day),
                    BackupPeriod.EveryWeek => string.Format("0 0 {0} ? * {1}", Hour, Day),
                    _ => base.ToString(),
                };
            }
        }

        public enum BackupPeriod
        {
            EveryDay = 0,
            EveryWeek = 1,
            EveryMonth = 2
        }
    }
    public static class BackupAjaxHandlerExtension
    {
        public static DIHelper AddBackupAjaxHandler(this DIHelper services)
        {
            services.TryAddScoped<BackupAjaxHandler>();
            return services
                .AddTenantManagerService()
                .AddCoreBaseSettingsService()
                .AddMessageServiceService()
                .AddCoreSettingsService()
                .AddPermissionContextService()
                .AddSecurityContextService()
                .AddUserManagerService()
                .AddTenantExtraService()
                .AddConsumerFactoryService()
                .AddBackupHelperService()
                .AddBackupServiceClient();
        }
    }
}

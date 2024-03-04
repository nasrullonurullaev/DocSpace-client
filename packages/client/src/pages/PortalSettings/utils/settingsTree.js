﻿import { PageType } from "@docspace/shared/enums";
import SettingsReactSvgUrl from "PUBLIC_DIR/images/settings.react.svg?url";
/**
 * Array for generation current settings tree.
 */

export const settingsTree = [
  {
    id: "portal-settings_catalog-customization",
    key: "0",
    type: PageType.customization,
    link: "customization",
    tKey: "Customization",
    isHeader: true,
    children: [
      {
        id: "portal-settings_catalog-general",
        key: "0-0",
        icon: "",
        link: "general",
        tKey: "SettingsGeneral",
        isCategory: true,
        children: [
          {
            id: "portal-settings_catalog-language-and-time-zone",
            key: "0-0-0",
            icon: "",
            link: "language-and-time-zone",
            tKey: "StudioTimeLanguageSettings",
          },
          {
            id: "portal-settings_catalog-welcome-page-settings",
            key: "0-0-1",
            icon: "",
            link: "welcome-page-settings",
            tKey: "CustomTitlesWelcome",
          },
          {
            id: "portal-settings_catalog-dns-settings",
            key: "0-0-2",
            icon: "",
            link: "dns-settings",
            tKey: "DNSSettings",
          },
          {
            id: "portal-settings_catalog-portal-renaming",
            key: "0-0-3",
            icon: "",
            link: "portal-renaming",
            tKey: "PortalRenaming",
          },
        ],
      },
      {
        id: "portal-settings_catalog-branding",
        key: "0-1",
        icon: "",
        link: "branding",
        tKey: "Branding",
        isCategory: true,
        children: [
          {
            id: "portal-settings_catalog-white-label",
            key: "0-1-0",
            icon: "",
            link: "white-label",
            tKey: "WhiteLabel",
          },
          {
            id: "portal-settings_catalog-company-info-settings",
            key: "0-1-1",
            icon: "",
            link: "company-info-settings",
            tKey: "CompanyInfoSettings",
          },
          {
            id: "portal-settings_catalog-additional-resources",
            key: "0-1-2",
            icon: "",
            link: "additional-resources",
            tKey: "AdditionalResources",
          },
        ],
      },
      {
        id: "portal-settings_catalog-appearance",
        key: "0-2",
        icon: "",
        link: "appearance",
        tKey: "Appearance",
        isCategory: true,
        children: [
          {
            id: "portal-settings_catalog-appearance_subLink",
            key: "0-2-0",
            icon: "",
            link: "appearance",
            tKey: "Appearance",
          },
        ],
      },
    ],
  },
  {
    id: "portal-settings_catalog-security",
    key: "1",
    type: PageType.security,
    link: "security",
    tKey: "ManagementCategorySecurity",
    isHeader: true,
    children: [
      {
        id: "portal-settings_catalog-access-portal",
        key: "1-0",
        icon: "",
        link: "access-portal",
        tKey: "PortalAccess",
        isCategory: true,
        children: [
          {
            id: "portal-settings_catalog-password",
            key: "1-0-0",
            icon: "",
            link: "password",
            tKey: "SettingPasswordTittle",
          },
          {
            id: "portal-settings_catalog-two-factor-auth",
            key: "1-0-1",
            icon: "",
            link: "tfa",
            tKey: "TwoFactorAuth",
          },
          {
            id: "portal-settings_catalog-trusted-mail",
            key: "1-0-2",
            icon: "",
            link: "trusted-mail",
            tKey: "TrustedMail",
          },
          {
            id: "portal-settings_catalog-ip-security",
            key: "1-0-3",
            icon: "",
            link: "ip",
            tKey: "IPSecurity",
          },
          {
            id: "portal-settings_catalog-brute-force-protection",
            key: "1-0-4",
            icon: "",
            link: "brute-force-protection",
            tKey: "BruteForceProtection",
          },
          {
            id: "portal-settings_catalog-admin-message",
            key: "1-0-5",
            icon: "",
            link: "admin-message",
            tKey: "AdminsMessage",
          },
          {
            id: "portal-settings_catalog-session-life-time",
            key: "1-0-6",
            icon: "",
            link: "lifetime",
            tKey: "SessionLifetime",
          },
        ],
      },
      {
        id: "portal-settings_catalog-access-rights",
        key: "1-1",
        icon: "",
        link: "access-rights",
        tKey: "AccessRights",
        isCategory: true,
        children: [
          {
            key: "1-1-0",
            icon: "",
            link: "admins",
            tKey: "Admins",
          },
        ],
      },
      {
        id: "portal-settings_catalog-login-history",
        key: "1-2",
        icon: "",
        link: "login-history",
        tKey: "LoginHistoryTitle",
        isCategory: true,
      },
      {
        id: "portal-settings_catalog-audit-trail",
        key: "1-3",
        icon: "",
        link: "audit-trail",
        tKey: "AuditTrailNav",
        isCategory: true,
      },
    ],
  },
  {
    id: "portal-settings_catalog-backup",
    key: "2",
    type: PageType.backup,
    link: "backup",
    tKey: "Backup",
    isHeader: true,
    children: [
      {
        id: "portal-settings_catalog-data-backup",
        key: "2-0",
        icon: "",
        link: "data-backup",
        tKey: "Backup",
        isCategory: true,
      },
      {
        id: "portal-settings_catalog-auto-backup",
        key: "2-1",
        icon: "",
        link: "auto-backup",
        tKey: "AutoBackup",
        isCategory: true,
      },
    ],
  },
  {
    id: "portal-settings_catalog-restore",
    key: "3",
    type: PageType.restore,
    link: "restore",
    tKey: "RestoreBackup",
    isHeader: true,
    children: [
      {
        key: "3-0",
        icon: "",
        link: "restore-backup",
        tKey: "RestoreBackup",
        isCategory: true,
      },
    ],
  },
  {
    id: "portal-settings_catalog-integration",
    key: "4",
    type: PageType.integration,
    link: "integration",
    tKey: "ManagementCategoryIntegration",
    isHeader: true,
    children: [
      {
        id: "portal-settings_catalog-third-party-services",
        key: "4-0",
        icon: "",
        link: "third-party-services",
        tKey: "ThirdPartyAuthorization",
        isCategory: true,
      },
      {
        id: "portal-settings_catalog-single-sign-on",
        key: "4-1",
        icon: "",
        link: "single-sign-on",
        tKey: "SingleSignOn",
        isCategory: true,
        children: [
          {
            id: "portal-settings_catalog-single-sign-on-sp-settings",
            key: "4-1-0",
            icon: "",
            link: "sp-settings",
            tKey: "SingleSignOn:ServiceProviderSettings",
          },
          {
            id: "portal-settings_catalog-single-sign-on-sp-metadata",
            key: "4-1-1",
            icon: "",
            link: "sp-metadata",
            tKey: "SingleSignOn:SpMetadata",
          },
        ],
      },
      {
        id: "portal-settings_catalog-plugins",
        key: "4-2",
        icon: "",
        link: "plugins",
        tKey: "Plugins",
        isCategory: true,
      },
      {
        id: "portal-settings_catalog-document-service",
        key: "4-3",
        icon: "",
        link: "document-service",
        tKey: "DocumentService",
        isCategory: true,
      },
      {
        id: "portal-settings_catalog-smtp-settings",
        key: "4-4",
        icon: "",
        link: "smtp-settings",
        tKey: "SMTPSettings",
        isCategory: true,
      },
    ],
  },
  {
    id: "portal-settings_catalog-portal-storageManagement",
    key: "5",
    type: PageType.storageManagement,
    link: "management",
    tKey: "StorageManagement",
    isHeader: true,
    children: [
      {
        id: "portal-settings_catalog-storageManagement",
        key: "5-0",
        icon: "",
        link: "disk-space",
        tKey: "StorageManagement",
        isCategory: true,
        children: [
          {
            id: "portal-settings_catalog-storageManagement_quota-per-room",
            key: "5-1-0",
            icon: "",
            link: "quota-per-room",
            tKey: "QuotaPerRoom",
          },
          {
            id: "portal-settings_catalog-storageManagement_quota-per-user",
            key: "5-1-1",
            icon: "",
            link: "quota-per-user",
            tKey: "QuotaPerUser",
          },
        ],
      },
    ],
  },
  {
    id: "portal-settings_catalog-developer-tools",
    key: "6",
    type: PageType.developerTools,
    link: "developer-tools",
    tKey: "Common:DeveloperTools",
    isHeader: true,
    children: [
      {
        id: "portal-settings_catalog-api",
        key: "6-0",
        icon: "",
        link: "api",
        tKey: "Api",
        isCategory: true,
      },
      {
        id: "portal-settings_catalog-javascript-sdk",
        key: "6-1",
        icon: "",
        link: "javascript-sdk",
        tKey: "Common:DeveloperTools",
        isCategory: true,
        children: [
          {
            id: "portal-settings_catalog-javascript-sdk_public-room",
            key: "6-1-0",
            icon: "",
            link: "public-room",
            tKey: "Files:PublicRoom",
          },
          {
            id: "portal-settings_catalog-javascript-sdk_custom",
            key: "6-1-1",
            icon: "",
            link: "custom",
            tKey: "JavascriptSdk:Custom",
          },
          {
            id: "portal-settings_catalog-javascript-sdk_room-selector",
            key: "6-1-2",
            icon: "",
            link: "room-selector",
            tKey: "JavascriptSdk:RoomSelector",
          },
          {
            id: "portal-settings_catalog-javascript-sdk_file-selector",
            key: "6-1-3",
            icon: "",
            link: "file-selector",
            tKey: "JavascriptSdk:FileSelector",
          },
          {
            id: "portal-settings_catalog-javascript-sdk_editor",
            key: "6-1-4",
            icon: "",
            link: "editor",
            tKey: "JavascriptSdk:Editor",
          },
          {
            id: "portal-settings_catalog-javascript-sdk_viewer",
            key: "6-1-5",
            icon: "",
            link: "viewer",
            tKey: "JavascriptSdk:Viewer",
          },
        ],
      },
      {
        id: "portal-settings_catalog-plugin-sdk",
        key: "6-2",
        icon: "",
        link: "plugin-sdk",
        tKey: "PluginSDK",
        isCategory: true,
      },
      {
        id: "portal-settings_catalog-webhooks",
        key: "6-3",
        icon: "",
        link: "webhooks",
        tKey: "Common:DeveloperTools",
        isCategory: true,
      },
    ],
  },
  {
    id: "portal-settings_catalog-delete",
    key: "7",
    type: PageType.portalDeletion,
    link: "delete-data",
    tKey: "PortalDeletion",
    isHeader: true,
    children: [
      {
        key: "7-0",
        icon: "",
        link: "deletion",
        tKey: "PortalDeletion",
        isCategory: true,
      },
      {
        key: "7-1",
        icon: "",
        link: "deactivation",
        tKey: "PortalDeactivation",
        isCategory: true,
      },
    ],
  },
  {
    id: "portal-settings_catalog-payments",
    key: "8",
    type: PageType.payments,
    link: "payments",
    tKey: "Common:PaymentsTitle",
    isHeader: true,
    children: [
      {
        id: "portal-settings_catalog-portal-payments",
        key: "8-0",
        icon: "",
        link: "portal-payments",
        tKey: "Common:PaymentsTitle",
        isCategory: true,
      },
    ],
  },
  {
    id: "portal-settings_catalog-bonus",
    key: "9",
    type: PageType.bonus,
    link: "bonus",
    tKey: "Common:Bonus",
    isHeader: true,
    children: [
      {
        id: "portal-settings_catalog-portal-bonus",
        key: "9-0",
        icon: "",
        link: "",
        tKey: "Common:FreeProFeatures",
        isCategory: true,
      },
    ],
  },
];

/**
* Array for generation full settings tree, old structure.
param title is unused
param link also used as translation key
*/
export const settingsTreeFull = [
  {
    title: "Common",
    key: "0",
    icon: SettingsReactSvgUrl,
    link: "common",
    children: [
      {
        title: "Customization",
        key: "0-0",
        icon: "",
        link: "customization",
      },
      {
        title: "Modules & tools",
        key: "0-1",
        icon: "",
        link: "modules-and-tools",
      },
      {
        title: "White label",
        key: "0-2",
        icon: "",
        link: "white-label",
      },
    ],
  },
  {
    title: "Security",
    key: "1",
    icon: SettingsReactSvgUrl,
    link: "security",
    children: [
      {
        title: "Portal Access",
        key: "1-0",
        icon: "",
        link: "portal-access",
      },
      {
        title: "Access Rights",
        key: "1-1",
        icon: "",
        link: "access-rights",
      },
      {
        title: "Login History",
        key: "1-2",
        icon: "",
        link: "login-history",
      },
      {
        title: "Audit Trail",
        key: "1-3",
        icon: "",
        link: "audit-trail",
      },
    ],
  },
  {
    title: "Data Management",
    key: "2",
    icon: SettingsReactSvgUrl,
    link: "data-management",
    children: [
      {
        title: "Migration",
        key: "2-0",
        icon: "",
        link: "migration",
      },
      {
        title: "Backup",
        key: "2-1",
        icon: "",
        link: "backup",
      },
      {
        title: "Portal Deactivation/Deletion",
        key: "2-2",
        icon: "",
        link: "portal-deactivation-deletion",
      },
    ],
  },
  {
    title: "Integration",
    key: "3",
    icon: SettingsReactSvgUrl,
    link: "integration",
    children: [
      {
        title: "Third-Party Services",
        key: "3-0",
        icon: "",
        link: "third-party-services",
      },

      {
        title: "SMTP Settings",
        key: "3-1",
        icon: "",
        link: "smtp-settings",
      },
    ],
  },
  {
    title: "Statistics",
    key: "4",
    icon: SettingsReactSvgUrl,
    link: "statistics",
  },
];

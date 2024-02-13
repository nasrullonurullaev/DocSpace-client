export enum ArticleAlerts {
  TeamTraining = "TeamTraining",
  SubmitToFormGallery = "SubmitToFormGallery",
}

/**
 * Enum for employee activation status.
 * @readonly
 */
export const enum EmployeeActivationStatus {
  NotActivated = 0,
  Activated = 1,
  Pending = 2,
  AutoGenerated = 4,
}
/**
 * Enum for employee status.
 * @readonly
 */
export const enum EmployeeStatus {
  Active = 1,
  Disabled = 2,
}
/**
 * Enum for employee type.
 * @readonly
 */
export const enum EmployeeType {
  User = 1,
  Guest = 2,
  Admin = 3,
  Collaborator = 4,
  UserString = "user",
  RoomAdmin = "manager",
  DocSpaceAdmin = "admin",
  Owner = "Owner",
  CollaboratorString = "collaborator",
}
/**
 * Enum for user payments type.
 * @readonly
 */
export const enum PaymentsType {
  Paid = "0",
  Free = "1",
}
/**
 * Enum for account login type.
 * @readonly
 */
export const enum AccountLoginType {
  SSO = "0",
  LDAP = "1",
  STANDART = "2",
}
/**
 * Enum for files selector filter.
 * @readonly
 */
export const enum ApplyFilterOption {
  All = "All",
  Files = "Files",
  Folder = "Folder",
}
/**
 * Enum for files selector filter.
 * @readonly
 */
export const enum FilesSelectorFilterTypes {
  DOCX = "DOCX",
  IMG = "IMG",
  GZ = "GZ",
  DOCXF = "DOCXF",
  XLSX = "XLSX",
  ALL = "ALL",
  BackupOnly = "BackupOnly",
}
/**
 * Enum for filter subject.
 * @readonly
 */
export const enum FilterSubject {
  Owner = "0",
  Member = "1",
}
/**
 * Enum for filter type.
 * @readonly
 */
export const enum FilterType {
  None = 0,
  FilesOnly = 1,
  FoldersOnly = 2,
  DocumentsOnly = 3,
  PresentationsOnly = 4,
  SpreadsheetsOnly = 5,
  ImagesOnly = 7,
  ByUser = 8,
  ByDepartment = 9,
  ArchiveOnly = 10,
  ByExtension = 11,
  MediaOnly = 12,
  OFormTemplateOnly = 18,
  OFormOnly = 19,
}

/**
 * Enum for file type.
 * @readonly
 */
export const enum FileType {
  Unknown = 0,
  Archive = 1,
  Video = 2,
  Audio = 3,
  Image = 4,
  Spreadsheet = 5,
  Presentation = 6,
  Document = 7,
  OFormTemplate = 8,
  OForm = 9,
}

/**
 * Enum for room provider type.
 * @readonly
 */
export const enum RoomsProviderType {
  Box = 1,
  DropBox = 2,
  GoogleDrive = 3,
  kDrive = 4,
  OneDrive = 5,
  SharePoint = 6,
  WebDav = 7,
  Yandex = 8,
}

/**
 * Enum for room search area.
 * @readonly
 */
export const enum RoomSearchArea {
  Any = "Any",
  Active = "Active",
  Archive = "Archive",
}
/**
 * Enum for file action.
 * @readonly
 */
export const enum FileAction {
  Create = 0,
  Rename = 1,
}

/**
 * @readonly
 */

export const enum PageType {
  account = "account",
  customization = "customization",
  security = "security",
  backup = "backup",
  restore = "restore",
  integration = "integration",
  developerTools = "developerTools",
  portalDeletion = "portalDeletion",
  payments = "payments",
  bonus = "bonus",
}

/**
 * Enum for root folders type.
 * @readonly
 */
export const enum FolderType {
  DEFAULT = 0,
  COMMON = 1,
  BUNCH = 2,
  TRASH = 3,
  USER = 5,
  SHARE = 6,
  Projects = 8,
  Favorites = 10,
  Recent = 11,
  Templates = 12,
  Privacy = 13,
  Rooms = 14,
  Archive = 20,

  Done = 25,
  InProgress = 26,
  SubFolderDone = 27,
  SubFolderInProgress = 28,
}

export const enum ShareAccessRights {
  None = 0,
  FullAccess = 1,
  ReadOnly = 2,
  DenyAccess = 3,
  Varies = 4,
  Review = 5,
  Comment = 6,
  FormFilling = 7,
  CustomFilter = 8,
  RoomManager = 9,
  Editing = 10,
  Collaborator = 11,
}
export const enum ConflictResolveType {
  Skip = 0,
  Overwrite = 1,
  Duplicate = 2,
}

/**
 * Enum for third-party storages.
 * @readonly
 */
export const enum ThirdPartyStorages {
  GoogleId = "googlecloud",
  RackspaceId = "rackspace",
  SelectelId = "selectel",
  AmazonId = "s3",
}
/**
 * Enum for backup types.
 * @readonly
 */
export const enum BackupStorageType {
  DocumentModuleType = 0,
  ResourcesModuleType = 1,
  LocalFileModuleType = 3,
  TemporaryModuleType = 4,
  StorageModuleType = 5,
}

export const enum AutoBackupPeriod {
  EveryDayType = 0,
  EveryWeekType = 1,
  EveryMonthType = 2,
}

/**
 * Enum for Tenant trusted domains on registration.
 * @readonly
 */
export const enum TenantTrustedDomainsType {
  None = 0,
  Custom = 1,
  All = 2,
}

/**
 * Enum for file status.
 * @readonly
 */
export const enum FileStatus {
  None = 0,
  IsEditing = 1,
  IsNew = 2,
  IsConverting = 4,
  IsOriginal = 8,
  IsEditingAlone = 16,
  IsFavorite = 32,
  IsTemplate = 64,
  IsFillFormDraft = 128,
}

/**
 * Enum for tenant status.
 * @readonly
 */
export const enum TenantStatus {
  PortalDeactivate = 1,
  PortalRestore = 4,
}

/**
 * Enum for theme keys.
 * @readonly
 */
export const enum ThemeKeys {
  Base = "0",
  BaseStr = "Base",
  Dark = "1",
  DarkStr = "Dark",
  System = "2",
  SystemStr = "System",
}

/**
 * Enum for global events.
 * @readonly
 */
export const enum Events {
  CREATE = "create",
  RENAME = "rename",
  ROOM_CREATE = "create_room",
  ROOM_EDIT = "edit_room",
  CHANGE_COLUMN = "change_column",
  CHANGE_USER_TYPE = "change_user_type",
  CREATE_PLUGIN_FILE = "create_plugin_file",
}

/**
 * Enum for feed action types.
 * @readonly
 */
export const enum FeedActionTypes {
  Create = 0,
  Update = 1,
  Rename = 2,
  Move = 3,
  Delete = 4,
}

/**
 * Enum for feed item types.
 * @readonly
 */
export const enum FeedItemTypes {
  File = "file",
  Folder = "folder",
  Room = "room",
  Tag = "tag",
  User = "sharedRoom",
}

/**
 * Enum for theme keys.
 * @readonly
 */
export const enum TariffState {
  Trial = 0,
  Paid = 1,
  Delay = 2,
  NotPaid = 3,
}

/**
 * Enum for theme keys.
 * @readonly
 */
export const enum PortalFeaturesLimitations {
  Limitless = -1,
  Unavailable = 0,
}

/**
 * Enum for notifications.
 * @readonly
 */
export const enum NotificationsType {
  Badges = 0,
  RoomsActivity = 1,
  DailyFeed = 2,
  UsefulTips = 3,
}

export const enum FilterGroups {
  filterType = "filter-filterType",
  filterAuthor = "filter-author",
  filterFolders = "filter-folders",
  filterRoom = "filter-room",
  filterContent = "filter-withContent",
  roomFilterProviderType = "filter-provider-type",
  roomFilterType = "filter-type",
  roomFilterSubject = "filter-subject",
  roomFilterOwner = "filter-owner",
  roomFilterTags = "filter-tags",
  roomFilterFolders = "filter-withSubfolders",
  roomFilterContent = "filter-content",
}

export const enum FilterKeys {
  withSubfolders = "withSubfolders",
  excludeSubfolders = "excludeSubfolders",
  withContent = "withContent",
  me = "me",
  other = "other",
  user = "user",
}

export const enum IndexedDBStores {
  images = "images",
}

export const enum FilterSelectorTypes {
  people = "people-selector",
  rooms = "rooms-selector",
}

export const enum DeviceType {
  mobile = "mobile",
  tablet = "tablet",
  desktop = "desktop",
}

export const enum ParseErrorTypes {
  None = 0,
  EmptyRecipients = 1,
  IncorrectEmail = 2,
}

export const enum ButtonKeys {
  enter = "enter",
  esc = "esc",
  tab = "Tab",
}

export const enum ErrorKeys {
  LocalDomain = "LocalDomain",
  IncorrectDomain = "IncorrectDomain",
  DomainIpAddress = "DomainIpAddress",
  PunycodeDomain = "PunycodeDomain",
  PunycodeLocalPart = "PunycodeLocalPart",
  IncorrectLocalPart = "IncorrectLocalPart",
  SpacesInLocalPart = "SpacesInLocalPart",
  MaxLengthExceeded = "MaxLengthExceeded",
  IncorrectEmail = "IncorrectEmail",
  ManyEmails = "ManyEmails",
  EmptyEmail = "EmptyEmail",
}

export enum RoomsType {
  FormRoom = 1,
  // FillingFormsRoom= 1, //TODO: Restore when certs will be done
  EditingRoom = 2,
  // ReviewRoom: 3, //TODO: Restore when certs will be done
  // ReadOnlyRoom: 4, //TODO: Restore when certs will be done
  PublicRoom = 6,
  CustomRoom = 5,
}

export enum AccountsSearchArea {
  People = "0",
  Groups = "1",
  Any = "2",
}

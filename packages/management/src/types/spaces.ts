

type TQuotaUsage = {
  tenantId: number,
  tenantAlias: string,
  tenantDomain: string,
  storageSize: number,
  usedSize: number,
  maxRoomAdminsCount: number,
  roomAdminCount: number,
  maxUsers: number,
  usersCount: number,
  maxRoomsCount: number
  roomsCount: number
}

export type TPortals = {
  created: string;
  domain: string;
  industry: number;
  language: string;
  name: string;
  ownerId: string;
  portalName: string;
  status: string;
  tenantId: number;
  timeZoneName: string;
  quotaUsage: TQuotaUsage
};

export type TNewPortalData = {
  firstName: string;
  lastName: string;
  email: string;
  portalName: string;
};

export type TranslationType = (key: string, opt?: object) => string;
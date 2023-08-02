import { ContextMenuModel } from "@docspace/components/types";
import { RoleTypeEnum } from "../enums/RoleType.enum";
import { IRole } from "../Models";

export type RoleTypeOwn = {
  id: number;
  title: string;
  badge: number;
  url: string;
  color?: string;
  isActive: boolean;
  isChecked: boolean;
  type: RoleTypeEnum;
  queueNumber: number;
  contextOptionsModel: string[];

  onClickBadge?: VoidFunction;
  onContentRowCLick: (
    role: IRole,
    checked: boolean,
    withSelection?: boolean
  ) => void;
  onChecked: (role: RoleType, checked: boolean) => void;
};

export interface RoleDefaultType extends RoleTypeOwn {
  assigned?: {
    id: string;
    hasAvatar: boolean;
    profileUrl: string;
    avatarSmall: string;
    displayName: string;
  };
  color: string;
  onClickLocation: VoidFunction;
  type: RoleTypeEnum.Default;
}

export interface RoleDoneType extends RoleTypeOwn {
  type: RoleTypeEnum.Done;
  color?: never;
}

export interface RoleInterruptedType extends RoleTypeOwn {
  type: RoleTypeEnum.Interrupted;
  color?: never;
}

export type RoleType = RoleDefaultType | RoleDoneType | RoleInterruptedType;
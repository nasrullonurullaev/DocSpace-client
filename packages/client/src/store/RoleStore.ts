import api from "@docspace/common/api";
import RoleFilter from "@docspace/common/api/files/roleFilter";

import { FolderType } from "@docspace/common/constants";
import { IRole } from "@docspace/common/Models";

import type {
  CurrentRoleResponseType,
  FileByRoleType,
  Folder as FolderInfoType,
  RoleQueue,
} from "@docspace/common/types";
import type DashboardContextOptionStore from "./DashboardContextOption";
import type DashboardStore from "./DashboardStore";
import type FilesStore from "./FilesStore";

class RoleStore {
  public role?: IRole;

  constructor(
    private filesStore: FilesStore,
    private dashboardStore: DashboardStore,
    private dashboardContextOptionStore: DashboardContextOptionStore
  ) {}

  private resetState = (): void => {
    const { setFolders, setBoards, setSelection, setSelected } =
      this.filesStore;

    setFolders([]);
    setBoards([]);
    setSelection([]);
    setSelected("close");
  };

  private settingUpNavigationPath = async (
    currentRole: CurrentRoleResponseType
  ) => {
    const navigationPath = await Promise.all(
      currentRole.pathParts.map(async (folderId) => {
        const { Rooms, Archive } = FolderType;

        const folderInfo: FolderInfoType = await api.files.getFolderInfo(
          folderId
        );

        const {
          id,
          title,
          rootFolderId,
          rootFolderType,
          roomType,
          type,
          parentId,
        } = folderInfo;

        const isRootRoom =
          rootFolderId === id &&
          (rootFolderType === Rooms || rootFolderType === Archive);

        return {
          id: folderId,
          title,
          isRoom: !!roomType,
          isRootRoom,
          isDashboard: type === FolderType.Dashboard,
          parentId,
        };
      })
    );

    const board = navigationPath.find((item) => item.isDashboard);

    this.filesStore.selectedFolderStore.setSelectedFolder({
      folders: [],
      ...currentRole.current,
      pathParts: currentRole.pathParts,
      parentId: board?.parentId,
      navigationPath: navigationPath.reverse(),
      isDashboard: false,
      isRolePage: true,
      new: currentRole.new,
    });

    this.filesStore.clientLoadingStore.setIsSectionHeaderLoading(false);
  };

  private setFiles = (files: FileByRoleType[], role: RoleQueue) => {
    const roleFiles = files.map((file) => ({
      ...file,
      roleFile: true,
      contextOptions: this.dashboardStore.getFilesContextOptionsMode(
        file,
        role
      ),
    }));

    this.filesStore.setFiles(roleFiles);
  };

  public setRole = (role: RoleQueue) => {
    this.role = this.dashboardStore.convertToRole(role);
  };

  public getRoleHeaderContextMenu = (t: (arg: string) => string) => {
    if (!this.role) return [];

    return this.dashboardContextOptionStore.getOptions(this.role, t);
  };
  public getRole = async (
    boardId: string,
    roleId: string,
    filter: RoleFilter
  ) => {
    try {
      const filterData = filter.clone();

      filterData.page = 0;
      filterData.pageCount = 100;

      const result: CurrentRoleResponseType = await api.files.getRole(
        boardId,
        roleId,
        filterData
      );

      filterData.total = result.total;

      this.resetState();
      this.setRole(result.current);
      this.setFiles(result.files, result.current);
      await this.settingUpNavigationPath(result);

      this.filesStore.setFilter(filter);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export default RoleStore;

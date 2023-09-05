import { makeAutoObservable } from "mobx";

class SelectFolderDialogStore {
  newPath = "";
  basePath = "";
  isErrorPath = false;

  constructor() {
    makeAutoObservable(this);
  }

  toDefault = () => {
    this.basePath = "";
    this.newPath = "";
    this.isErrorPath = false;
  };

  convertPath = (foldersArray) => {
    let path = "";

    if (foldersArray.length === 0) {
      this.setIsErrorPath(true);

      return path;
    }

    if (foldersArray.length > 1) {
      for (let item of foldersArray) {
        if (!path) {
          path = path + `${item.label}`;
        } else path = path + " " + "/" + " " + `${item.label}`;
      }
    } else {
      for (let item of foldersArray) {
        path = `${item.label}`;
      }
    }

    return path;
  };

  resetNewFolderPath = () => {
    this.newPath = this.basePath;
  };

  updateBaseFolderPath = () => {
    this.basePath = this.newPath;
  };

  setNewPath = (folders) => {
    this.newPath = this.convertPath(folders);

    this.setIsErrorPath(false);
  };

  setBasePath = (folders) => {
    this.basePath = this.convertPath(folders);
  };

  setIsErrorPath = (isErrorPath) => {
    this.isErrorPath = isErrorPath;
  };
}

export default new SelectFolderDialogStore();

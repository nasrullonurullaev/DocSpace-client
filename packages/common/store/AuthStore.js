import { makeAutoObservable, runInAction } from "mobx";
import api from "@docspace/shared/api";
import { setWithCredentialsStatus } from "@docspace/shared/api/client";

import SettingsStore from "./SettingsStore";
import BannerStore from "./BannerStore";
import UserStore from "./UserStore";
import TfaStore from "./TfaStore";
import InfoPanelStore from "./InfoPanelStore";
import {
  logout as logoutDesktop,
  desktopConstants,
} from "@docspace/shared/utils/desktop";
import { isAdmin } from "@docspace/shared/utils/common";
import { getCookie, setCookie } from "@docspace/shared/utils/cookie";
import CurrentQuotasStore from "./CurrentQuotaStore";
import CurrentTariffStatusStore from "./CurrentTariffStatusStore";
import PaymentQuotasStore from "./PaymentQuotasStore";

import { TenantStatus } from "@docspace/shared/enums";
import { COOKIE_EXPIRATION_YEAR } from "@docspace/shared/constants";
import { LANGUAGE } from "@docspace/shared/constants";
import { getPortalTenantExtra } from "@docspace/shared/api/portal";

class AuthStore {
  userStore = null;

  settingsStore = null;
  tfaStore = null;
  infoPanelStore = null;

  isLoading = false;
  version = null;

  providers = [];
  capabilities = [];
  isInit = false;

  isLogout = false;
  isUpdatingTariff = false;

  tenantExtra = {};

  constructor() {
    this.userStore = new UserStore();

    this.settingsStore = new SettingsStore();
    this.tfaStore = new TfaStore();
    this.infoPanelStore = new InfoPanelStore();
    this.currentQuotaStore = new CurrentQuotasStore(this.userStore);
    this.currentTariffStatusStore = new CurrentTariffStatusStore(this);
    this.paymentQuotasStore = new PaymentQuotasStore();
    this.bannerStore = new BannerStore();

    makeAutoObservable(this);

    const { socketHelper } = this.settingsStore;

    socketHelper.on("s:change-quota-used-value", ({ featureId, value }) => {
      console.log(`[WS] change-quota-used-value ${featureId}:${value}`);

      runInAction(() => {
        this.currentQuotaStore.updateQuotaUsedValue(featureId, value);
      });
    });

    socketHelper.on("s:change-quota-feature-value", ({ featureId, value }) => {
      console.log(`[WS] change-quota-feature-value ${featureId}:${value}`);

      runInAction(() => {
        if (featureId === "free") {
          this.updateTariff();
          return;
        }

        this.currentQuotaStore.updateQuotaFeatureValue(featureId, value);
      });
    });

    socketHelper.on(
      "s:change-user-quota-used-value",
      ({ customQuotaFeature, usedSpace, quotaLimit }) => {
        console.log(
          `[WS] change-user-quota-used-value: quota type ${customQuotaFeature} usedSpace:${usedSpace}, quotaLimit: ${quotaLimit}`
        );

        runInAction(() => {
          if (customQuotaFeature === "user_custom_quota") {
            this.userStore.updateUserQuota(usedSpace, quotaLimit);

            return;
          }

          // this.currentQuotaStore.updateTenantCustomQuota({ quota: quotaLimit });
        });
      }
    );
  }

  setIsUpdatingTariff = (isUpdatingTariff) => {
    this.isUpdatingTariff = isUpdatingTariff;
  };

  updateTariff = async () => {
    this.setIsUpdatingTariff(true);

    await this.getTenantExtra();
    await this.currentTariffStatusStore.setPayerInfo();

    this.setIsUpdatingTariff(false);
  };
  init = async (skipRequest = false, i18n) => {
    if (this.isInit) return;
    this.isInit = true;

    this.skipRequest = skipRequest;

    await this.settingsStore.init();

    const requests = [];

    const isPortalDeactivated = this.settingsStore.isPortalDeactivate;

    const isPortalRestore =
      this.settingsStore.tenantStatus === TenantStatus.PortalRestore;

    const { user } = this.userStore;

    if (
      this.settingsStore.isLoaded &&
      this.settingsStore.socketUrl &&
      !this.settingsStore.isPublicRoom &&
      !isPortalDeactivated
    ) {
      requests.push(
        this.userStore.init(i18n).then(() => {
          if (this.isQuotaAvailable && !isPortalRestore) {
            this.getTenantExtra();
          }
        })
      );
    } else {
      this.userStore.setIsLoaded(true);
    }

    if (this.isAuthenticated && !skipRequest) {
      !isPortalRestore &&
        !isPortalDeactivated &&
        requests.push(this.settingsStore.getAdditionalResources());

      if (!this.settingsStore.passwordSettings) {
        if (!isPortalRestore && !isPortalDeactivated) {
          requests.push(this.settingsStore.getCompanyInfoSettings());
        }
      }
    }

    return Promise.all(requests).then(() => {
      const { user } = this.userStore;

      if (
        this.settingsStore.standalone &&
        !this.settingsStore.wizardToken &&
        this.isAuthenticated &&
        user.isAdmin
      ) {
        requests.push(this.settingsStore.getPortals());
      }
    });
  };

  get isEnterprise() {
    return this.tenantExtra.enterprise;
  }
  get isCommunity() {
    return this.tenantExtra.opensource;
  }

  getTenantExtra = async () => {
    let refresh = false;
    if (window.location.search === "?complete=true") {
      window.history.replaceState({}, document.title, window.location.pathname);
      refresh = true;
    }

    const result = await getPortalTenantExtra(refresh);

    if (!result) return;

    const { tariff, quota, ...tenantExtra } = result;

    runInAction(() => {
      this.tenantExtra = { ...tenantExtra };
    });

    this.currentQuotaStore.setPortalQuotaValue(quota);
    this.currentTariffStatusStore.setPortalTariffValue(tariff);
  };
  setLanguage() {
    if (this.userStore.user?.cultureName) {
      getCookie(LANGUAGE) !== this.userStore.user.cultureName &&
        setCookie(LANGUAGE, this.userStore.user.cultureName, {
          "max-age": COOKIE_EXPIRATION_YEAR,
        });
    } else {
      setCookie(LANGUAGE, this.settingsStore.culture || "en-US", {
        "max-age": COOKIE_EXPIRATION_YEAR,
      });
    }
  }

  get isLoaded() {
    let success = false;
    if (this.isAuthenticated) {
      success = this.userStore.isLoaded && this.settingsStore.isLoaded;

      success && this.setLanguage();
    } else {
      success = this.settingsStore.isLoaded;
    }

    return success;
  }

  get language() {
    return (
      (this.userStore.user && this.userStore.user.cultureName) ||
      this.settingsStore.culture ||
      "en"
    );
  }

  get languageBaseName() {
    try {
      const intl = new Intl.Locale(this.language);
      return intl.minimize().baseName;
    } catch {
      return "en";
    }
  }

  get isAdmin() {
    const { user } = this.userStore;
    const { currentProductId } = this.settingsStore;

    if (!user || !user.id) return false;

    return isAdmin(user, currentProductId);
  }

  get isRoomAdmin() {
    const { user } = this.userStore;

    if (!user) return false;

    return (
      !user.isAdmin && !user.isOwner && !user.isVisitor && !user.isCollaborator
    );
  }

  get isQuotaAvailable() {
    const { user } = this.userStore;

    if (!user) return false;

    return (
      user.isOwner || user.isAdmin || this.isRoomAdmin || user.isCollaborator
    );
  }

  get isPaymentPageAvailable() {
    const { user } = this.userStore;

    if (!user) return false;

    return user.isOwner || user.isAdmin;
  }

  get isTeamTrainingAlertAvailable() {
    const { user } = this.userStore;

    if (!user) return false;

    return (
      !!this.settingsStore.bookTrainingEmail &&
      (user.isOwner || user.isAdmin || this.isRoomAdmin)
    );
  }

  get isSubmitToGalleryAlertAvailable() {
    const { user } = this.userStore;
    if (!user) return false;
    return !user.isVisitor;
  }

  get isLiveChatAvailable() {
    const { user } = this.userStore;

    if (!user) return false;

    return (
      !!this.settingsStore.zendeskKey &&
      (user.isOwner || user.isAdmin || this.isRoomAdmin)
    );
  }

  login = async (user, hash, session = true) => {
    try {
      const response = await api.user.login(user, hash, session);

      if (!response || (!response.token && !response.tfa))
        throw response.error.message;

      if (response.tfa && response.confirmUrl) {
        const url = response.confirmUrl.replace(window.location.origin, "");
        return Promise.resolve({ url, user, hash });
      }

      setWithCredentialsStatus(true);

      this.reset();

      this.init();

      return Promise.resolve({ url: this.settingsStore.defaultPage });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  loginWithCode = async (userName, passwordHash, code) => {
    await this.tfaStore.loginWithCode(userName, passwordHash, code);
    setWithCredentialsStatus(true);

    this.reset();

    this.init();

    return Promise.resolve(this.settingsStore.defaultPage);
  };

  thirdPartyLogin = async (SerializedProfile) => {
    try {
      const response = await api.user.thirdPartyLogin(SerializedProfile);

      if (!response || !response.token) throw new Error("Empty API response");

      setWithCredentialsStatus(true);

      this.reset();

      this.init();

      return Promise.resolve(this.settingsStore.defaultPage);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  reset = (skipUser = false) => {
    this.isInit = false;
    this.skipModules = false;
    if (!skipUser) {
      this.userStore = new UserStore();
    }

    this.settingsStore = new SettingsStore();
  };

  logout = async (reset = true) => {
    const ssoLogoutUrl = await api.user.logout();

    this.isLogout = true;

    const { isDesktopClient: isDesktop } = this.settingsStore;

    isDesktop && logoutDesktop();

    if (ssoLogoutUrl) return ssoLogoutUrl;

    if (!reset) return;

    setWithCredentialsStatus(false);
    this.reset(true);
    this.userStore.setUser(null);
    this.init();
  };

  get isAuthenticated() {
    return (
      this.settingsStore.isLoaded &&
      !!this.settingsStore.socketUrl &&
      !this.settingsStore.isPublicRoom
      //|| //this.userStore.isAuthenticated
    );
  }

  getEncryptionAccess = (fileId) => {
    return api.files
      .getEncryptionAccess(fileId)
      .then((keys) => {
        return Promise.resolve(keys);
      })
      .catch((err) => console.error(err));
  };

  replaceFileStream = (fileId, file, encrypted, forcesave) => {
    return api.files.updateFileStream(file, fileId, encrypted, forcesave);
  };

  setEncryptionAccess = (file) => {
    return this.getEncryptionAccess(file.id).then((keys) => {
      return new Promise((resolve, reject) => {
        try {
          window.AscDesktopEditor.cloudCryptoCommand(
            "share",
            {
              cryptoEngineId: desktopConstants.cryptoEngineId,
              file: [file.viewUrl],
              keys: keys,
            },
            (obj) => {
              let resFile = null;
              if (obj.isCrypto) {
                let bytes = obj.bytes;
                let filename = "temp_name";
                resFile = new File([bytes], filename);
              }
              resolve(resFile);
            }
          );
        } catch (e) {
          reject(e);
        }
      });
    });
  };

  setDocumentTitle = (subTitle = null) => {
    let title;

    const currentModule = this.settingsStore.product;
    const organizationName = this.settingsStore.organizationName;

    if (subTitle) {
      if (this.isAuthenticated && currentModule) {
        title = subTitle + " - " + currentModule.title;
      } else {
        title = subTitle + " - " + organizationName;
      }
    } else if (currentModule && organizationName) {
      title = currentModule.title + " - " + organizationName;
    } else {
      title = organizationName;
    }

    document.title = title;
  };

  setProductVersion = (version) => {
    this.version = version;
  };

  setProviders = (providers) => {
    this.providers = providers;
  };

  setCapabilities = (capabilities) => {
    this.capabilities = capabilities;
  };

  getAuthProviders = async () => {
    const providers = await api.settings.getAuthProviders();
    if (providers) this.setProviders(providers);
  };

  getCapabilities = async () => {
    const capabilities = await api.settings.getCapabilities();
    if (capabilities) this.setCapabilities(capabilities);
  };

  get isManagement() {
    return window.location.pathname.includes("management");
  }
}

export default new AuthStore();

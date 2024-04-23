// (c) Copyright Ascensio System SIA 2009-2024
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

import React from "react";
import { useSSR, useTranslation } from "react-i18next";
import { toastr } from "@docspace/shared/components/toast";
import { getFontFamilyDependingOnLanguage } from "@docspace/shared/utils/rtlUtils";
import ErrorBoundary from "./ErrorBoundary";
import App from "../App";
import i18n from "../i18n";
import { I18nextProvider } from "react-i18next";
import { inject, observer, Provider as MobxProvider } from "mobx-react";
import { ThemeProvider } from "@docspace/shared/components/theme-provider";
import store from "client/store";
import { BrowserRouter } from "react-router-dom";
import GlobalStyles from "./GlobalStyle";

interface IClientApp extends IInitialState {
  initialLanguage: string;
  initialI18nStoreASC: any;
  isDesktopEditor: boolean;
  theme: IUserTheme;
  setTheme: (theme: IUserTheme) => void;
}

const ThemeProviderWrapper = inject(({ settingsStore }, props) => {
  const { currentColorScheme } = props;

  const { i18n } = useTranslation();

  return {
    theme: {
      ...settingsStore.theme,
      interfaceDirection: i18n.dir(),
      fontFamily: getFontFamilyDependingOnLanguage(i18n.language),
    },
    currentColorScheme,
  };
})(ThemeProvider);

const ClientApp: React.FC<IClientApp> = ({
  initialLanguage,
  initialI18nStoreASC,
  ...rest
}) => {
  useSSR(initialI18nStoreASC, initialLanguage);
  const { currentColorScheme } = rest;
  return (
    <BrowserRouter forceRefresh>
      <MobxProvider {...store}>
        <I18nextProvider i18n={i18n}>
          <ThemeProviderWrapper currentColorScheme={currentColorScheme}>
            <App {...rest} />
          </ThemeProviderWrapper>
        </I18nextProvider>
      </MobxProvider>
    </BrowserRouter>
  );
};

const ClientAppWrapper: React.FC<IClientApp> = (props) => {
  const onError = (errorInfo: any) => {
    toastr.error(errorInfo);
  };
  return (
    <ErrorBoundary onError={onError}>
      <ClientApp {...props} />
    </ErrorBoundary>
  );
};

export default ClientAppWrapper;

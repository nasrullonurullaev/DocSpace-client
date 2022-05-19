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

namespace ASC.Web.Api.Controllers;

[DefaultRoute]
[ApiController]
[AllowAnonymous]
public class CapabilitiesController : ControllerBase
{
    private readonly CoreBaseSettings _coreBaseSettings;
    private readonly TenantManager _tenantManager;
    private readonly ProviderManager _providerManager;
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger _log;


    public CapabilitiesController(
        CoreBaseSettings coreBaseSettings,
        TenantManager tenantManager,
        ProviderManager providerManager,
        IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor,
        ILogger<CapabilitiesController> logger)
    {
        _coreBaseSettings = coreBaseSettings;
        _tenantManager = tenantManager;
        _providerManager = providerManager;
        _configuration = configuration;
        _httpContextAccessor = httpContextAccessor;
        _log = logger;
    }

    ///<summary>
    ///Returns the information about portal capabilities
    ///</summary>
    ///<short>
    ///Get portal capabilities
    ///</short>
    ///<returns>CapabilitiesData</returns>
    [Read(Check = false)] //NOTE: this method doesn't requires auth!!!  //NOTE: this method doesn't check payment!!!
    public CapabilitiesDto GetPortalCapabilities()
    {
        var result = new CapabilitiesDto
        {
            LdapEnabled = false,
            Providers = null,
            SsoLabel = string.Empty,
            SsoUrl = string.Empty
        };

        try
        {
            if (SetupInfo.IsVisibleSettings(nameof(ManagementType.LdapSettings))
                && (!_coreBaseSettings.Standalone
                    || _tenantManager.GetTenantQuota(_tenantManager.GetCurrentTenant().Id).Ldap))
            {
                //var settings = SettingsManager.Load<LdapSettings>();

                //result.LdapEnabled = settings.EnableLdapAuthentication;
                result.LdapEnabled = false;
            }
        }
        catch (Exception ex)
        {
            _log.ErrorWithException(ex);
        }

        try
        {
            result.Providers = ProviderManager.AuthProviders.Where(loginProvider =>
            {
                var provider = _providerManager.GetLoginProvider(loginProvider);
                return provider != null && provider.IsEnabled;
            })
            .ToList();
        }
        catch (Exception ex)
        {
            _log.ErrorWithException(ex);
        }

        try
        {
            if (SetupInfo.IsVisibleSettings(nameof(ManagementType.SingleSignOnSettings))
                && _tenantManager.GetTenantQuota(_tenantManager.GetCurrentTenant().Id).Sso)
            {
                //var settings = SettingsManager.Load<SsoSettingsV2>();

                //if (settings.EnableSso)
                //{
                var uri = _httpContextAccessor.HttpContext.Request.GetUrlRewriter();

                var configUrl = _configuration["web:sso:saml:login:url"] ?? "";

                result.SsoUrl = $"{uri.Scheme}://{uri.Host}{((uri.Port == 80 || uri.Port == 443) ? "" : ":" + uri.Port)}{configUrl}";
                result.SsoLabel = string.Empty;
                //    result.SsoLabel = settings.SpLoginLabel;
                //}
            }
        }
        catch (Exception ex)
        {
            _log.ErrorWithException(ex);
        }

        return result;
    }
}
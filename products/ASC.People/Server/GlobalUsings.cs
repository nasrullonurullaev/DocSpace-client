﻿global using System.Net.Mail;
global using System.Runtime.InteropServices;
global using System.Security;
global using System.ServiceModel.Security;
global using System.Web;

global using ASC.Api.Core;
global using ASC.Api.Utils;
global using ASC.Common;
global using ASC.Common.Logging;
global using ASC.Common.Utils;
global using ASC.Common.Web;
global using ASC.Core;
global using ASC.Core.Common.Settings;
global using ASC.Core.Tenants;
global using ASC.Core.Users;
global using ASC.Data.Reassigns;
global using ASC.FederatedLogin;
global using ASC.FederatedLogin.LoginProviders;
global using ASC.FederatedLogin.Profile;
global using ASC.MessagingSystem.Core;
global using ASC.MessagingSystem.Models;
global using ASC.People;
global using ASC.People.Models;
global using ASC.People.Resources;
global using ASC.Security.Cryptography;
global using ASC.Web.Api.Models;
global using ASC.Web.Api.Routing;
global using ASC.Web.Core;
global using ASC.Web.Core.Mobile;
global using ASC.Web.Core.PublicResources;
global using ASC.Web.Core.Users;
global using ASC.Web.Studio.Core;
global using ASC.Web.Studio.Core.Notify;
global using ASC.Web.Studio.UserControls.Statistics;
global using ASC.Web.Studio.Utility;

global using Autofac.Extensions.DependencyInjection;

global using Microsoft.AspNetCore.Authorization;
global using Microsoft.AspNetCore.Http.Extensions;
global using Microsoft.AspNetCore.Mvc;
global using Microsoft.Extensions.Options;

global using SixLabors.ImageSharp;
global using SixLabors.ImageSharp.Formats;

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

namespace ASC.Migration.NextcloudWorkspace.Models.Parse;

[Transient]
public class NCMigratingUser : MigratingUser<NCMigratingFiles>
{
    public override string Email => _userInfo.Email;

    public override string DisplayName => _userInfo.ToString();

    public Guid Guid => _userInfo.Id;

    private string _rootFolder;
    private bool _hasPhoto;
    private string _pathToPhoto;
    private UserInfo _userInfo;
    private readonly UserManager _userManager;
    private NCUser _user;
    private readonly IServiceProvider _serviceProvider;
    private readonly Regex _emailRegex = new Regex(@"(\S*@\S*\.\S*)");
    private readonly Regex _phoneRegex = new Regex(@"(\+?\d+)");

    public NCMigratingUser(UserManager userManager,
        IServiceProvider serviceProvider)
    {
        _userManager = userManager;
        _serviceProvider = serviceProvider;
    }

    public void Init(NCUser user, string rootFolder, Action<string, Exception> log)
    {
        Key = user.Uid;
        _rootFolder = rootFolder;
        _user = user;
        Log = log;
    }

    public override void Parse()
    {
        _userInfo = new UserInfo()
        {
            Id = Guid.NewGuid(),
            ContactsList = new List<string>()
        };
        var drivePath = Directory.Exists(Path.Combine(_rootFolder, "data", Key, "cache")) ?
            Path.Combine(_rootFolder, "data", Key, "cache") : null;
        if (drivePath == null)
        {
            _hasPhoto = false;
        }
        else
        {
            _pathToPhoto = File.Exists(Path.Combine(drivePath, "avatar_upload")) ? Directory.GetFiles(drivePath, "avatar_upload")[0] : null;
            _hasPhoto = _pathToPhoto != null ? true : false;
        }

        if (!_hasPhoto)
        {
            var appdataDir = Directory.GetDirectories(Path.Combine(_rootFolder, "data")).Where(dir => dir.Split(Path.DirectorySeparatorChar).Last().StartsWith("appdata_")).First();
            if (appdataDir != null)
            {
                var pathToAvatarDir = Path.Combine(appdataDir, "avatar", Key);
                _pathToPhoto = File.Exists(Path.Combine(pathToAvatarDir, "generated")) ? null : Path.Combine(pathToAvatarDir, "avatar.jpg");
                _hasPhoto = _pathToPhoto != null ? true : false;
            }
        }
        var userName = _user.Data.DisplayName.Split(' ');
        _userInfo.FirstName = userName[0];
        if (userName.Length > 1)
        {
            _userInfo.LastName = userName[1];
        }
        _userInfo.Location = _user.Data.Address;
        if (_user.Data.Phone != null)
        {
            var phone = _phoneRegex.Match(_user.Data.Phone);
            if (phone.Success)
            {
                _userInfo.ContactsList.Add(phone.Groups[1].Value);
            }
        }
        if (_user.Data.Twitter != null)
        {
            _userInfo.ContactsList.Add(_user.Data.Twitter);

        }
        if (_user.Data.Email != null && _user.Data.Email != "" && _user.Data.Email != "NULL")
        {
            var email = _emailRegex.Match(_user.Data.Email);
            if (email.Success)
            {
                _userInfo.Email = email.Groups[1].Value;
            }
            _userInfo.UserName = _userInfo.Email.Split('@').First();
        }
        _userInfo.ActivationStatus = EmployeeActivationStatus.Pending;
        Action<string, Exception> log = (m, e) => { Log($"{DisplayName} ({Email}): {m}", e); };

        MigratingFiles = _serviceProvider.GetService<NCMigratingFiles>();
        MigratingFiles.Init(_rootFolder, this, _user.Storages, log);

        MigratingFiles.Parse();
    }

    public void DataСhange(MigratingApiUser frontUser)
    {
        if (_userInfo.Email == null)
        {
            _userInfo.Email = frontUser.Email;
            if (_userInfo.UserName == null)
            {
                _userInfo.UserName = _userInfo.Email.Split('@').First();
            }
        }
        if (_userInfo.LastName == null)
        {
            _userInfo.LastName = "NOTPROVIDED";
        }
    }

    public override async Task MigrateAsync()
    {
        if (string.IsNullOrWhiteSpace(_userInfo.FirstName))
        {
            _userInfo.FirstName = FilesCommonResource.UnknownFirstName;
        }
        if (string.IsNullOrWhiteSpace(_userInfo.LastName))
        {
            _userInfo.LastName = FilesCommonResource.UnknownLastName;
        }

        var saved = await _userManager.GetUserByEmailAsync(_userInfo.Email);
        if (saved != ASC.Core.Users.Constants.LostUser)
        {
            if (saved.ContactsList != null)
            {
                saved.ContactsList = saved.ContactsList.Union(_userInfo.ContactsList).ToList();
            }
            else
            {
                saved.ContactsList = _userInfo.ContactsList;
            }
            _userInfo.Id = saved.Id;
        }
        else
        {
            saved = await _userManager.SaveUserInfo(_userInfo);
        }
        if (_hasPhoto)
        {
            using (var ms = new MemoryStream())
            {
                using (var fs = File.OpenRead(_pathToPhoto))
                {
                    fs.CopyTo(ms);
                }
                await _userManager.SaveUserPhotoAsync(saved.Id, ms.ToArray());
            }
        }
    }
}

﻿/*
 *
 * (c) Copyright Ascensio System Limited 2010-2021
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/


using ASC.ActiveDirectory.Base.Settings;
using ASC.Common;
using ASC.Common.Logging;
using ASC.Core.Tenants;
using ASC.Core.Users;

using Mapping = ASC.ActiveDirectory.Base.Settings.LdapSettings.MappingFields;

namespace ASC.ActiveDirectory.Base.Data
{
    /// <summary>
    /// LDAP object extensions class
    /// </summary>
    [Scope]
    public class LdapObjectExtension
    {
        private readonly TenantUtil _tenantUtil;
        public LdapObjectExtension(TenantUtil tenantUtil)
        {
            _tenantUtil = tenantUtil;
        }
        public static string GetAttribute(LdapObject ldapObject, string attribute, ILog log = null)
        {
            if (string.IsNullOrEmpty(attribute))
                return string.Empty;

            try
            {
                return ldapObject.GetValue(attribute) as string;
            }
            catch (Exception e)
            {
                if (log != null)
                    log.ErrorFormat("Can't get attribute from ldap object (attr = {0}, dn = {1}) error: {2}",
                        attribute, ldapObject.DistinguishedName, e);

                return string.Empty;
            }
        }

        public static List<string> GetAttributes(LdapObject ldapObject, string attribute, ILog log = null)
        {
            var list = new List<string>();

            if (string.IsNullOrEmpty(attribute))
                return list;

            try
            {
                return ldapObject.GetValues(attribute);
            }
            catch (Exception e)
            {
                if (log != null)
                    log.ErrorFormat("Can't get attributes from ldap object (attr = {0}, dn = {1}) error: {2}",
                        attribute, ldapObject.DistinguishedName, e);

                return list;
            }
        }

        private const int MAX_NUMBER_OF_SYMBOLS = 64;
        private const string EXT_MOB_PHONE = "extmobphone";
        private const string EXT_MAIL = "extmail";
        private const string EXT_PHONE = "extphone";
        private const string EXT_SKYPE = "extskype";

        private static List<string> GetContacts(LdapObject ldapUser, Mapping key, LdapSettings settings, ILog log = null)
        {
            if (!settings.LdapMapping.ContainsKey(key))
                return null;

            var bindings = settings.LdapMapping[key].Split(',').Select(x => x.Trim()).ToArray();
            if (bindings.Length > 1)
            {
                var list = new List<string>();
                foreach (var bind in bindings)
                {
                    list.AddRange(GetAttributes(ldapUser, bind, log));
                }
                return list;
            }
            else
            {
                return GetAttributes(ldapUser, bindings[0], log);
            }
        }

        private static void PopulateContacts(List<string> Contacts, string type, List<string> values)
        {
            if (values == null || !values.Any())
                return;
            foreach (var val in values)
            {
                Contacts.Add(type);
                Contacts.Add(val);
            }
        }

        public UserInfo ToUserInfo(LdapObject ldapUser, LdapUserImporter ldapUserImporter, ILog log = null)
        {
            var settings = ldapUserImporter.Settings;
            var resource = ldapUserImporter.Resource;

            var userName = GetAttribute(ldapUser, settings.LoginAttribute, log);

            var firstName = settings.LdapMapping.ContainsKey(Mapping.FirstNameAttribute) ? GetAttribute(ldapUser, settings.LdapMapping[Mapping.FirstNameAttribute], log) : string.Empty;
            var secondName = settings.LdapMapping.ContainsKey(Mapping.SecondNameAttribute) ? GetAttribute(ldapUser, settings.LdapMapping[Mapping.SecondNameAttribute], log) : string.Empty;
            var birthDay = settings.LdapMapping.ContainsKey(Mapping.BirthDayAttribute) ? GetAttribute(ldapUser, settings.LdapMapping[Mapping.BirthDayAttribute], log) : string.Empty;
            var gender = settings.LdapMapping.ContainsKey(Mapping.GenderAttribute) ? GetAttribute(ldapUser, settings.LdapMapping[Mapping.GenderAttribute], log) : string.Empty;
            var primaryPhone = settings.LdapMapping.ContainsKey(Mapping.MobilePhoneAttribute) ? GetAttribute(ldapUser, settings.LdapMapping[Mapping.MobilePhoneAttribute], log) : string.Empty;
            var mail = settings.LdapMapping.ContainsKey(Mapping.MailAttribute) ? GetAttribute(ldapUser, settings.LdapMapping[Mapping.MailAttribute], log) : string.Empty;
            var title = settings.LdapMapping.ContainsKey(Mapping.TitleAttribute) ? GetAttribute(ldapUser, settings.LdapMapping[Mapping.TitleAttribute], log) : string.Empty;
            var location = settings.LdapMapping.ContainsKey(Mapping.LocationAttribute) ? GetAttribute(ldapUser, settings.LdapMapping[Mapping.LocationAttribute], log) : string.Empty;

            var phones = GetContacts(ldapUser, Mapping.AdditionalPhone, settings, log);
            var mobilePhones = GetContacts(ldapUser, Mapping.AdditionalMobilePhone, settings, log);
            var emails = GetContacts(ldapUser, Mapping.AdditionalMail, settings, log);
            var skype = GetContacts(ldapUser, Mapping.Skype, settings, log);


            if (string.IsNullOrEmpty(userName))
                throw new Exception("LDAP LoginAttribute is empty");

            var contacts = new List<string>();

            PopulateContacts(contacts, EXT_PHONE, phones);
            PopulateContacts(contacts, EXT_MOB_PHONE, mobilePhones);
            PopulateContacts(contacts, EXT_MAIL, emails);
            PopulateContacts(contacts, EXT_SKYPE, skype);

            var user = new UserInfo
            {
                ID = Guid.Empty,
                UserName = userName,
                Sid = ldapUser.Sid,
                ActivationStatus = settings.SendWelcomeEmail && !string.IsNullOrEmpty(mail) ? EmployeeActivationStatus.Pending : EmployeeActivationStatus.NotActivated,
                Status = ldapUser.IsDisabled ? EmployeeStatus.Terminated : EmployeeStatus.Active,
                Title = !string.IsNullOrEmpty(title) ? title : string.Empty,
                Location = !string.IsNullOrEmpty(location) ? location : string.Empty,
                WorkFromDate = _tenantUtil.DateTimeNow(),
                ContactsList = contacts
            };

            if (!string.IsNullOrEmpty(firstName))
            {
                user.FirstName = firstName.Length > MAX_NUMBER_OF_SYMBOLS
                    ? firstName.Substring(0, MAX_NUMBER_OF_SYMBOLS)
                    : firstName;
            }
            else
            {
                user.FirstName = resource.FirstName;
            }

            if (!string.IsNullOrEmpty(secondName))
            {
                user.LastName = secondName.Length > MAX_NUMBER_OF_SYMBOLS
                    ? secondName.Substring(0, MAX_NUMBER_OF_SYMBOLS)
                    : secondName;
            }
            else
            {
                user.LastName = resource.LastName;
            }

            if (!string.IsNullOrEmpty(birthDay))
            {
                DateTime date;
                if (DateTime.TryParse(birthDay, out date))
                    user.BirthDate = date;
            }

            if (!string.IsNullOrEmpty(gender))
            {
                bool b;
                if (bool.TryParse(gender, out b))
                {
                    user.Sex = b;
                }
                else
                {
                    switch (gender.ToLowerInvariant())
                    {
                        case "male":
                        case "m":
                            user.Sex = true;
                            break;
                        case "female":
                        case "f":
                            user.Sex = false;
                            break;
                    }
                }
            }

            if (string.IsNullOrEmpty(mail))
            {
                user.Email = userName.Contains("@") ? userName : string.Format("{0}@{1}", userName, ldapUserImporter.LDAPDomain);
                user.ActivationStatus = EmployeeActivationStatus.AutoGenerated;
            }
            else
            {
                user.Email = mail;
            }

            user.MobilePhone = string.IsNullOrEmpty(primaryPhone)
                ? null : primaryPhone;

            return user;
        }

        public static GroupInfo ToGroupInfo(LdapObject ldapGroup, LdapSettings settings, ILog log = null)
        {
            var name = GetAttribute(ldapGroup, settings.GroupNameAttribute, log);

            if (string.IsNullOrEmpty(name))
                throw new Exception("LDAP GroupNameAttribute is empty");

            var group = new GroupInfo
            {
                Name = name,
                Sid = ldapGroup.Sid
            };

            return group;
        }

        public static string GetDomainFromDn(LdapObject ldapObject)
        {
            if (ldapObject == null || string.IsNullOrEmpty(ldapObject.DistinguishedName))
                return null;

            return LdapUtils.DistinguishedNameToDomain(ldapObject.DistinguishedName);
        }
    }
}

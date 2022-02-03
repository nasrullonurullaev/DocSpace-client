/*
 *
 * (c) Copyright Ascensio System Limited 2010-2018
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU 
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html). 
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that 
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@onlyoffice.com
 *
 * The interactive user interfaces in modified source and object code versions of ONLYOFFICE must display 
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7 § 3(b) of the GNU GPL you must retain the original ONLYOFFICE logo which contains 
 * relevant author attributions when distributing the software. If the display of the logo in its graphic 
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by ONLYOFFICE" 
 * in every copy of the program you distribute. 
 * Pursuant to Section 7 § 3(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
*/


using System.Net.Mail;
using System.Text;

namespace ASC.Common.Utils
{
    public static class MailAddressUtils
    {
        public static MailAddress Create(string address)
        {
            if (!string.IsNullOrEmpty(address))
            {
                var firstPos = address.IndexOf('"');
                var lastPos = address.LastIndexOf('"');

                if (firstPos != -1 && firstPos < lastPos && address.IndexOf('"', firstPos + 1, lastPos - firstPos - 1) != -1)
                    address = new StringBuilder(address).Replace("\"", string.Empty, firstPos + 1, lastPos - firstPos - 1).ToString();
            }

            return new MailAddress(address);
        }

        public static MailAddress Create(string address, string displayName)
        {
            if (!string.IsNullOrEmpty(displayName))
            {
                displayName = displayName.Replace("\"", string.Empty);

                if (125 < displayName.Length)
                    displayName = displayName.Substring(0, 125);
            }

            return Create(ToSmtpAddress(address, displayName));
        }

        public static string ToEncodedString(this MailAddress m) =>
            ToSmtpAddress(m.Address, MimeHeaderUtils.EncodeMime(m.DisplayName));

        private static string ToSmtpAddress(string address, string displayName) => $"\"{displayName}\" <{address}>";
    }
}
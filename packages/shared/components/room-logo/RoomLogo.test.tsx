// (c) Copyright Ascensio System SIA 2010-2024
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

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { RoomsType } from "../../enums";

import { RoomLogo } from "./RoomLogo";

const baseProps = {
  type: RoomsType.CustomRoom,
  isPrivacy: false,
  isArchive: false,
};

describe("<RoomLogo />", () => {
  it("renders without error", () => {
    render(<RoomLogo {...baseProps} />);

    expect(screen.getByTestId("room-logo")).toBeInTheDocument();
  });

  // it("accepts id", () => {
  //   // @ts-expect-error TS(2322): Type '{ id: string; type: string; isPrivacy: boole... Remove this comment to see the full error message
  //   const wrapper = mount(<RoomLogo {...baseProps} id="testId" />);

  //   // @ts-expect-error TS(2304): Cannot find name 'expect'.
  //   expect(wrapper.prop("id")).toEqual("testId");
  // });

  // it("accepts className", () => {
  //   // @ts-expect-error TS(2322): Type '{ className: string; type: string; isPrivacy... Remove this comment to see the full error message
  //   const wrapper = mount(<RoomLogo {...baseProps} className="test" />);

  //   // @ts-expect-error TS(2304): Cannot find name 'expect'.
  //   expect(wrapper.prop("className")).toEqual("test");
  // });

  // it("accepts style", () => {
  //   // @ts-expect-error TS(2322): Type '{ style: { color: string; }; type: string; i... Remove this comment to see the full error message
  //   const wrapper = mount(<RoomLogo {...baseProps} style={{ color: "red" }} />);

  //   // @ts-expect-error TS(2304): Cannot find name 'expect'.
  //   expect(wrapper.getDOMNode().style).toHaveProperty("color", "red");
  // });

  // it("accepts isPrivacy prop", () => {
  //   // @ts-expect-error TS(2322): Type '{ isPrivacy: true; type: string; isArchive: ... Remove this comment to see the full error message
  //   const wrapper = mount(<RoomLogo {...baseProps} isPrivacy={true} />);

  //   // @ts-expect-error TS(2304): Cannot find name 'expect'.
  //   expect(wrapper.prop("isPrivacy")).toEqual(true);
  // });

  // it("accepts isPrivacy prop", () => {
  //   // @ts-expect-error TS(2322): Type '{ isArchive: true; type: string; isPrivacy: ... Remove this comment to see the full error message
  //   const wrapper = mount(<RoomLogo {...baseProps} isArchive={true} />);

  //   // @ts-expect-error TS(2304): Cannot find name 'expect'.
  //   expect(wrapper.prop("isArchive")).toEqual(true);
  // });
});

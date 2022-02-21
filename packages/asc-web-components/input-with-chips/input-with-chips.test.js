import React from "react";
import { mount } from "enzyme";
import InputWithChips from ".";

const baseProps = {
  placeholder: "Placeholder",
  clearButtonLabel: "Clear list ",
  existEmailText: "This email address has already been entered",
  invalidEmailText: "Invalid email",
};

describe("<InputWithChips />", () => {
  it("accepts id", () => {
    const wrapper = mount(<InputWithChips {...baseProps} id="testId" />);

    expect(wrapper.prop("id")).toEqual("testId");
  });

  it("accepts className", () => {
    const wrapper = mount(<InputWithChips {...baseProps} className="test" />);

    expect(wrapper.prop("className")).toEqual("test");
  });

  it("accepts style", () => {
    const wrapper = mount(
      <InputWithChips {...baseProps} style={{ color: "red" }} />
    );

    expect(wrapper.getDOMNode().style).toHaveProperty("color", "red");
  });
});

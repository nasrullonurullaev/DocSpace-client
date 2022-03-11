import React from "react";
import PropTypes from "prop-types";
import Loader from "../loader";
import StyledButton from "./styled-button";
import Base from "../themes/base";
import { isDesktop } from "../utils/device";

// eslint-disable-next-line no-unused-vars, react/prop-types

const Icon = ({ size, primary, icon, isHovered }) => (
  <div className="btnIcon">
    {icon &&
      React.cloneElement(icon, {
        //isfill: true,
        size:
          size === "medium"
            ? "medium"
            : size === "normalTouchscreen"
            ? "normalDesktop"
            : "extraSmall",
        color: icon.props.color
          ? isHovered
            ? icon.props.hoveredcolor
            : icon.props.color
          : primary
          ? "#FFFFFF"
          : "#333333",
      })}
  </div>
);

Icon.propTypes = {
  icon: PropTypes.node,
  size: PropTypes.string,
  primary: PropTypes.bool,
};

Icon.defaultProps = {
  icon: null,
};

const Button = React.forwardRef((props, ref) => {
  let { primary, size, isLoading, icon, label, isHovered } = props;

  const iconProps = { primary, size, icon, isHovered };

  return (
    <StyledButton innerRef={ref} {...props}>
      {isLoading || icon ? (
        isLoading ? (
          <Loader
            type="oval"
            size={
              size === "medium" ? "20px" : size === "normal" ? "16px" : "14px"
            }
            color={primary ? "#FFFFFF" : "#333333"}
            className="loader"
          />
        ) : (
          <Icon {...iconProps} />
        )
      ) : (
        ""
      )}
      {label}
    </StyledButton>
  );
});

Button.propTypes = {
  /** Button text */
  label: PropTypes.string,
  /** Tells when the button should be primary */
  primary: PropTypes.bool,
  /** Size of button */
  size: PropTypes.oneOf(["extraSmall", "small", "normal", "medium"]),
  /** Scale width of button to 100% */
  scale: PropTypes.bool,
  /** Icon node element */
  icon: PropTypes.node,
  /** Button tab index */
  tabIndex: PropTypes.number,
  /** Accepts class */
  className: PropTypes.string,
  /** Accepts id */
  id: PropTypes.string,
  /** Accepts CSS style */
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  /** Tells when the button should present a hovered state */
  isHovered: PropTypes.bool,
  /** Disable hover effect */
  disableHover: PropTypes.bool,
  /** Tells when the button should present a clicked state */
  isClicked: PropTypes.bool,
  /** Tells when the button should present a disabled state */
  isDisabled: PropTypes.bool,
  /** Tells when the button should show loader icon */
  isLoading: PropTypes.bool,
  /** Sets the nim width of the button */
  minwidth: PropTypes.string,
  /** What the button will trigger when clicked */
  onClick: PropTypes.func,
};

Button.defaultProps = {
  label: "",
  primary: false,
  size: "base",
  theme: Base,
  scale: false,
  icon: null,

  tabIndex: -1,

  minwidth: null,

  isHovered: false,
  disableHover: false,
  isClicked: false,
  isDisabled: false,
  isLoading: false,
};

Button.displayName = "Button";

export default Button;

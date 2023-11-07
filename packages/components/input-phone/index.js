import { useState, useEffect } from "react";
import { useTheme } from "styled-components";
import { FixedSizeList as List } from "react-window";
import PropTypes from "prop-types";

import { options } from "./options";
import { StyledBox } from "./styled-input-phone";

import InvalidSvgUrl from "PUBLIC_DIR/images/phoneFlags/invalid.svg?url";
import CustomScrollbarsVirtualList from "../scrollbar/custom-scrollbars-virtual-list";
import Box from "SRC_DIR/box";
import ComboBox from "SRC_DIR/combobox";
import Label from "SRC_DIR/label";
import TextInput from "SRC_DIR/text-input";
import SearchInput from "SRC_DIR/search-input";
import DropDown from "SRC_DIR/drop-down";
import DropDownItem from "SRC_DIR/drop-down-item";
import Text from "SRC_DIR/text";

const PLUS = "+";

const InputPhone = ({
  defaultCountry,
  onChange,
  scaled,
  phonePlaceholderText,
  searchPlaceholderText,
  searchEmptyMessage,
  errorMessage,
} = props) => {
  const [country, setCountry] = useState(defaultCountry);
  const [phoneValue, setPhoneValue] = useState(country.dialCode);
  const [searchValue, setSearchValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const theme = useTheme();
  const isRtl = theme.interfaceDirection === "rtl";

  const onInputChange = (e) => {
    const str = e.target.value.replace(/\D/g, "");
    const el = options.find(
      (option) => option.dialCode && str.startsWith(option.dialCode)
    );
    const singleCode = ["1", "7"];
    const invalidCode = singleCode.find((code) => code === str);

    if (e.target.value === "" || !e.target.value.includes(invalidCode)) {
      setIsValid(false);
      setCountry((prev) => ({ ...prev, icon: InvalidSvgUrl }));
    }

    setPhoneValue(e.target.value);

    if (el) {
      setIsValid(true);
      setCountry({
        locale: el.code,
        mask: el.mask,
        icon: el.flag,
      });
    }
    onChange && onChange(e);
  };

  const onCountrySearch = (value) => {
    setSearchValue(value);
  };

  const onClearSearch = () => {
    setSearchValue("");
  };

  const getMask = (locale) => {
    return options.find((option) => option.code === locale).mask;
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      setFilteredOptions(
        options.filter(
          (val) =>
            val.name.toLowerCase().startsWith(searchValue.toLowerCase()) ||
            val.dialCode.startsWith(searchValue.toLowerCase())
        )
      );
    }
  }, [isOpen, searchValue]);

  const onCountryClick = (e) => {
    const data = e.currentTarget.dataset.option;
    const country = filteredOptions[data];

    setIsOpen(!isOpen);
    setCountry({
      locale: country.code,
      mask: country.mask,
      icon: country.flag,
    });
    setIsValid(true);
    setPhoneValue(country.dialCode);
  };

  const Row = ({ data, index, style }) => {
    const country = data[index];
    const prefix = "+";
    const RtlRowComponent = () => (
      <>
        <Text className="country-dialcode">{country.dialCode}</Text>
        <Text className="country-prefix">{prefix}</Text>
        <Text className="country-name">{country.name}</Text>
      </>
    );
    const LtrRowComponent = () => (
      <>
        <Text className="country-name">{country.name}</Text>
        <Text className="country-prefix">{prefix}</Text>
        <Text className="country-dialcode">{country.dialCode}</Text>
      </>
    );

    return (
      <DropDownItem
        key={country.code}
        style={style}
        icon={country.flag}
        fillIcon={false}
        className="country-item"
        data-option={index}
        onClick={onCountryClick}
      >
        {isRtl ? <RtlRowComponent /> : <LtrRowComponent />}
      </DropDownItem>
    );
  };

  return (
    <StyledBox
      hasError={!isValid}
      displayProp="flex"
      alignItems="center"
      scaled={scaled}
    >
      <ComboBox
        options={[]}
        noBorder={true}
        opened={isOpen}
        data="country"
        onToggle={handleClick}
        displayType="toggle"
        className="country-box"
        fillIcon={true}
        selectedOption={country}
      />
      {!isRtl && <Label text={PLUS} className="prefix" />}
      <TextInput
        type="tel"
        className="input-phone"
        placeholder={phonePlaceholderText}
        mask={getMask(country.locale)}
        withBorder={false}
        tabIndex={1}
        value={phoneValue}
        onChange={onInputChange}
      />
      {isRtl && <Label text={PLUS} className="prefix" />}

      <DropDown
        open={isOpen}
        clickOutsideAction={handleClick}
        isDefaultMode={false}
        className="drop-down"
        manualWidth="100%"
      >
        <SearchInput
          placeholder={searchPlaceholderText}
          value={searchValue}
          className="search-country_input"
          scale={true}
          onClearSearch={onClearSearch}
          refreshTimeout={100}
          onChange={onCountrySearch}
        />
        <Box marginProp="6px 0 0">
          {filteredOptions.length ? (
            <List
              itemData={filteredOptions}
              height={108}
              itemCount={filteredOptions.length}
              itemSize={36}
              outerElementType={CustomScrollbarsVirtualList}
              width="auto"
            >
              {Row}
            </List>
          ) : (
            <Text
              textAlign="center"
              className="phone-input_empty-text"
              fontSize="14px"
            >
              {searchEmptyMessage}
            </Text>
          )}
        </Box>
      </DropDown>

      {!isValid && (
        <Text
          className="phone-input_error-text"
          color="#f21c0e"
          fontSize="11px"
          lineHeight="14px"
        >
          {errorMessage}
        </Text>
      )}
    </StyledBox>
  );
};

InputPhone.propTypes = {
  /** Default selected country */
  defaultCountry: PropTypes.object.isRequired,
  /** Text displayed on the Input placeholder */
  phonePlaceholderText: PropTypes.string,
  /** Text displayed on the SearchInput placeholder */
  searchPlaceholderText: PropTypes.string,
  /** Indicates that the input field has scaled */
  scaled: PropTypes.bool,
  /** The callback function that is called when the value is changed */
  onChange: PropTypes.func,
  /** Gets the country mask  */
  searchEmptyMessage: PropTypes.string,
  /** Text displayed in case of the invalid country dial code */
  errorMessage: PropTypes.string,
};

InputPhone.defaultProps = {
  defaultCountry: {
    locale: options[182].code, // default locale RU
    dialCode: options[182].dialCode, // default dialCode +7
    mask: options[182].mask, // default Russia mask
    icon: options[182].flag, // default Russia flag
  },
  phonePlaceholderText: "",
  searchPlaceholderText: "",
  scaled: false,
  searchEmptyMessage: "",
  errorMessage: "",
};

InputPhone.displayName = "InputPhone";

export default InputPhone;

import React from "react";
import TextInput from "@appserver/components/text-input";

const regionInput = "region";
const publicInput = "public_container";
const privateInput = "private_container";
class RackspaceSettings extends React.Component {
  static formNames = () => {
    return [regionInput, publicInput, privateInput];
  };

  constructor(props) {
    super(props);
    const { availableStorage, selectedId } = this.props;

    this.isDisabled =
      availableStorage[selectedId] && !availableStorage[selectedId].isSet;

    this.privatePlaceholder =
      availableStorage[selectedId] &&
      availableStorage[selectedId].properties[0].title;

    this.publicPlaceholder =
      availableStorage[selectedId] &&
      availableStorage[selectedId].properties[1].title;

    this.regionPlaceholder =
      availableStorage[selectedId] &&
      availableStorage[selectedId].properties[2].title;
  }

  render() {
    const {
      formSettings,
      isError,
      isLoadingData,
      isLoading,
      onChange,
    } = this.props;

    return (
      <>
        <TextInput
          name={privateInput}
          className="backup_text-input"
          scale
          value={formSettings.private_container}
          hasError={isError?.private_container}
          onChange={onChange}
          isDisabled={isLoadingData || isLoading || this.isDisabled}
          placeholder={this.privatePlaceholder || ""}
          tabIndex={1}
        />
        <TextInput
          name={publicInput}
          className="backup_text-input"
          scale
          value={formSettings.public_container}
          hasError={isError?.public_container}
          onChange={onChange}
          isDisabled={isLoadingData || isLoading || this.isDisabled}
          placeholder={this.publicPlaceholder || ""}
          tabIndex={2}
        />
        <TextInput
          name={regionInput}
          className="backup_text-input"
          scale
          value={formSettings.region}
          hasError={isError?.region}
          onChange={onChange}
          isDisabled={isLoadingData || isLoading || this.isDisabled}
          placeholder={this.regionPlaceholder || ""}
          tabIndex={3}
        />
      </>
    );
  }
}
export default RackspaceSettings;

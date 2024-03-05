import React from "react";

import { Heading } from "../../heading";
import { Text } from "../../text";

import { StyledEmptyScreen } from "../Selector.styled";
import { EmptyScreenProps } from "../Selector.types";

const EmptyScreen = ({
  image,
  header,
  description,
  searchImage,
  searchHeader,
  searchDescription,
  withSearch,
}: EmptyScreenProps) => {
  const currentImage = withSearch ? searchImage : image;
  const currentHeader = withSearch ? searchHeader : header;
  const currentDescription = withSearch ? searchDescription : description;

  return (
    <StyledEmptyScreen withSearch={withSearch}>
      <img className="empty-image" src={currentImage} alt="empty-screen" />

      <Heading level={3} className="empty-header">
        {currentHeader}
      </Heading>

      <Text className="empty-description" noSelect>
        {currentDescription}
      </Text>
    </StyledEmptyScreen>
  );
};

export { EmptyScreen };

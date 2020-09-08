import React from "react";
import PropTypes from "prop-types";
import { Box, Text } from "asc-web-components";
import ConsumerToggle from "./consumerToggle";

class ConsumerItem extends React.Component {
  render() {
    const {
      consumer,
      consumers,
      onModalOpen,
      setConsumer,
      sendConsumerNewProps,
    } = this.props;

    const logo = `/images/thirdparties/${consumer.name.toLowerCase()}.svg`;

    return (
      <>
        <Box displayProp="flex" flexDirection="column" widthProp="100%">
          <Box
            displayProp="flex"
            justifyContent="space-between"
            alignItems="center"
            widthProp="100%"
            heightProp="56px"
          >
            <Box>
              <img src={logo} />
            </Box>
            <Box onClick={setConsumer} data-consumer={consumer.name}>
              <ConsumerToggle
                consumer={consumer}
                onModalOpen={onModalOpen}
                sendConsumerNewProps={sendConsumerNewProps}
              />
            </Box>
          </Box>
          <Box displayProp="flex" marginProp="21px 0 0 0">
            <Text>{consumer.description}</Text>
          </Box>
        </Box>
      </>
    );
  }
}

export default ConsumerItem;

ConsumerItem.propTypes = {
  consumer: PropTypes.object.isRequired,
  consumers: PropTypes.array.isRequired,
  onModalOpen: PropTypes.func.isRequired,
  setConsumer: PropTypes.func.isRequired,
  sendConsumerNewProps: PropTypes.func.isRequired
}

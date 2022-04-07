import React from "react";
import PropTypes from "prop-types";
import ErrorContainer from "@appserver/common/components/ErrorContainer";
import { useTranslation } from "react-i18next";

const Error520 = ({ match }) => {
  const { t } = useTranslation(["Common"]);
  const { error } = (match && match.params) || {};

  return (
    <ErrorContainer headerText={t("SomethingWentWrong")} bodyText={error} />
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError(error) {
    console.log("getDerivedStateFromError");
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
    console.log("componentDidCatch");
    this.props.onError && this.props.onError();
  }

  render() {
    console.log("render error boundary");
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <Error520 />;
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.any,
  onError: PropTypes.func,
};

export default ErrorBoundary;

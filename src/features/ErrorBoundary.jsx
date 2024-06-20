import { NotFound } from "@/pages/NotFound";
import React from "react";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    if (hasError) {
      console.log("Error reported to error reporting service");
    }
  }, [hasError]);

  if (hasError) {
    return <NotFound />;
  }

  return children;
};

export default ErrorBoundary;

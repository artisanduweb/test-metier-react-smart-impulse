import ErrorBoundary from '../features/ErrorBoundary';
import './App.css';
import { router } from "./route";
import { RouterProvider } from "react-router";

const App = () => {
  return <ErrorBoundary><RouterProvider router={router} /></ErrorBoundary>
};

export default App;
import './App.css';
import { router } from "./route";
import { RouterProvider } from "react-router";

const App = () => {
  return <RouterProvider router={router} />
};

export default App;
import { createBrowserRouter } from "react-router-dom";
import Invoice from "../components/Invoice";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Transactions from "../pages/Transactions";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/invoice",
    element: <Invoice />,
  },
  {
    path: "transactions",
    element: <Transactions />,
  },
]);

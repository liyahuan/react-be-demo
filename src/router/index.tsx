import { Link, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Home from "../pages/Home";
import Layout from "../pages/Layout";
import About from "../pages/About";
import Board from "../pages/Board";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
  },
  {
    path: 'board/:name',
    element: <Board />,
  },
  {
    path: 'about',
    element: <About />,
  },
  {
    path: "about",
    element: <About />,
  },
]);
export default router;

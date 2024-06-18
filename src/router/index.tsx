import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import About from "../pages/About";
import Board from "../pages/Board";
import {Header} from "../components/header";
import { Button } from "../components/Button";
import Submit from "../pages/Form";
import Home from "../pages/Home";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
  },
  {
    path: 'board/:name?',
    element: <Board />,
  },
  {
    path: 'home',
    element: <Home />,
  },
  {
    path: "about",
    element: <About />,
  },
  {
    path: "form",
    element: <Submit />,
  },
  {
    path: "header",
    element: <Header heading={""} subtext={""} headercon={""} imageBoolean={false} isSelected={true} />,
  },
  {
    path: 'button',
    element: <Button label={"test button"} primary={true}></Button>
  }
]);
export default router;

import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import About from "../pages/About";
import Board from "../pages/Board";
import {Header} from "../components/header";
import { Button } from "../components/Button";
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
    path: 'about',
    element: <About />,
  },
  {
    path: "about",
    element: <About />,
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

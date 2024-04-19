import { Link, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "about",
    element: <About />,
  },
]);
// export default router;
// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route
//         path="/"
//         element={<Home />}

//         path="/about"
//         element={<About />}
//     />
//   )
// )
export default router;

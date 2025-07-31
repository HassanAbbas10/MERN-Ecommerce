import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./Pages/Home";
import Contact from "./Pages/Contact";
import Cart from "./Pages/Cart";
import ProductDetails from "./Pages/ProductDetails";
import "./App.css";
import { lazy,Suspense } from "react";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

const Layout = () => {
  
  return (
    <div className="app">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

//TODO:Well i still need to add use navigation so i can go to the page giving product info 🎃
const Products = lazy(() => import("./Pages/Products"));
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/products",
        element: (
          <Suspense fallback={<div>Loading🎃🎡</div>}>
            <Products />
          </Suspense>
        ),
      },
      {
        path: "/products/:id",
        element: <ProductDetails />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
    ],
  },
]);

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;

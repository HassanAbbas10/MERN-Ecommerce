import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { PageLoadingSpinner } from "./components/Loading/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

// Lazy load all page components for better performance
const Home = lazy(() => import("./Pages/Home"));
const Contact = lazy(() => import("./Pages/Contact"));
const Cart = lazy(() => import("./Pages/Cart"));
const ProductDetails = lazy(() => import("./Pages/ProductDetails"));
const Login = lazy(() => import("./Pages/Login"));
const Signup = lazy(() => import("./Pages/Signup"));
const Orders = lazy(() => import("./Pages/Orders"));
const Products = lazy(() => import("./Pages/Products"));
const Customization = lazy(() => import("./Pages/Customization"));
const SimpleCanvasTest = lazy(() => import("./Pages/SimpleCanvasTest"));

const Layout = () => {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <div className="app">
          <Header />
          <Outlet />
          <Footer />
        </div>
      </ErrorBoundary>
    </AuthProvider>
  );
};

//TODO:Well i still need to add use navigation so i can go to the page giving product info 🎃
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<PageLoadingSpinner message="Loading home page..." />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/products",
        element: (
          <Suspense fallback={<PageLoadingSpinner message="Loading products..." />}>
            <Products />
          </Suspense>
        ),
      },
      {
        path: "/products/:id",
        element: (
          <Suspense fallback={<PageLoadingSpinner message="Loading product details..." />}>
            <ProductDetails />
          </Suspense>
        ),
      },
      {
        path: "/contact",
        element: (
          <Suspense fallback={<PageLoadingSpinner message="Loading contact page..." />}>
            <Contact />
          </Suspense>
        ),
      },
      {
        path: "/cart",
        element: (
          <Suspense fallback={<PageLoadingSpinner message="Loading your cart..." />}>
            <Cart />
          </Suspense>
        ),
      },
      {
        path: "/customization",
        element: (
          <Suspense fallback={<PageLoadingSpinner message="Loading customization..." />}>
            <Customization />
          </Suspense>
        ),
      },
      {
        path: "/canvas-test",
        element: (
          <Suspense fallback={<PageLoadingSpinner message="Loading canvas test..." />}>
            <SimpleCanvasTest />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<PageLoadingSpinner message="Loading login..." />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "/signup",
        element: (
          <Suspense fallback={<PageLoadingSpinner message="Loading signup..." />}>
            <Signup />
          </Suspense>
        ),
      },
      {
        path: "/orders",
        element: (
          <Suspense fallback={<PageLoadingSpinner message="Loading your orders..." />}>
            <Orders />
          </Suspense>
        ),
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

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import orange from "@mui/material/colors/orange";
import ShoppingCartTwoToneIcon from "@mui/icons-material/ShoppingCartTwoTone";
import Search from "../Search/Search";
import HeaderSec from "./HeaderSec";
const Header = () => {
  const cart = useSelector((state) => state.cart.cart);
  return (
    <>
    <nav className="top-0 p-3 py-4 z-10 bg-white rounded-b-md border-b border-solid border-slate-300 sticky backdrop-filter backdrop-blur-lg bg-opacity-30">
      <div className="container mx-auto relative">
        <div className="flex flex-wrap items-center justify-between px-4">
          <div className="flex items-center justify-center w-full lg:w-auto z-10">
            <p className="text-orange-300 text-3xl">
              Dev <span className="text-red-500 italic">Shop</span>
            </p>
          </div>

          <div className="w-full lg:w-auto my-2 lg:my-0 flex justify-center lg:justify-start z-10">
            <Search />
          </div>

          <ul className="flex w-full lg:w-auto justify-center lg:justify-end items-center list-none gap-4 lg:gap-10 text-white mt-4 lg:mt-0">
            <li className="active:text-orange-400">
              <Link to="/" className="text-orange-500 italic">
                Home
              </Link>
            </li>
            <li >
              <Link to="/products" className="text-orange-500 italic">
                Shop
              </Link>
            </li>
            <li className="">
              <Link to="/contact" className="text-orange-500 italic">
                Contact
              </Link>
            </li>
            <li className="relative">
              <Link to="/cart" className="text-orange-500 italic flex items-center">
                <ShoppingCartTwoToneIcon sx={{ color: orange[700] }}/>
                <span className="text-white bg-orange-500 absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 py-0.5 px-2 border-orange-400 rounded-full text-xs">
                  {cart.length}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
     
    </nav>
    <HeaderSec/>
    </>
  );
};

export default Header;
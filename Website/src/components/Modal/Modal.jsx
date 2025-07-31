import { useState } from "react";
import orange from "@mui/material/colors/orange";
import ShoppingCartTwoToneIcon from "@mui/icons-material/ShoppingCartTwoTone";
const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div >
      <ShoppingCartTwoToneIcon
        onClick={handleOpen}
        className="absolute"
        sx={{ color: orange[700] }}
      />

      <span className="bg-orange-500 relative bottom-[1.3rem] 
      py-[0.1rem] left-3 px-2 border-orange-400 rounded-full
       ">
        0
      </span>

      {isOpen ? (
        <div
          className="fixed top-48 z-50 left-1/2 -translate-x-1/2 -translate-y-1/2 
          w-96 bg-white bg-opacity-85 backdrop-blur-lg 
          rounded drop-shadow-lg px-8 py-6 space-y-5
          shadow-purple-400 shadow-inner border border-gray-300 border-solid
          "
          open
        >
          <h1 className="text-orange-400 text-xl text-center font-semibold">
            Cart
          </h1>
          <div className="text-orange-400 py-5 border-t border-b border-gray-300">
            <ul>
                <li>
                    A
                </li>
                
    
            </ul>
          </div>
          <div className="flex justify-end"></div>
        </div>
      ) : null}
    </div>
  );
};

export default Modal;

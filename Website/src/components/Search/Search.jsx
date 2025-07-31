/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";

const Search = () => {
  const [inputVal, setInputVal] = useState("");
  const [apiData, setApiData] = useState([]);
  const [isListOpen, setIsListOpen] = useState(false);

  const handlechange = (e) => {
    setInputVal(e.target.value);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".search-container")) {
      setIsListOpen(false);
      setInputVal("")
    }
  };

  useEffect(() => {
    let listfunc;
    if (isListOpen === true) {
      listfunc = document.addEventListener("click", handleClickOutside);
    } else {
      listfunc = document.removeEventListener("click", handleClickOutside);
    }
    return listfunc;
  }, [isListOpen]);

  const apiUrl = `https://dummyjson.com/products/search?q=${inputVal}&limit=4`;
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setApiData(data.products);
    };

    if (inputVal) {
      fetchData();
    }
  }, [apiUrl, inputVal]);

  return (
    <div className="sm:container  sm:max-w-lg w-full flex flex-col relative z-20 search-container">
      <div className="flex items-center justify-center relative">
        <input
          id="search"
          type="text"
          placeholder="Search your products ... "
          onChange={handlechange}
          value={inputVal}
          className="sm:px-8 text-sm sm:text-lg py-2 border border-gray-400
          px-14
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 rounded-full w-[22rem] sm:w-[24rem]"
          onClick={() => setIsListOpen(true)}
        />
        <button  className="bg-orange-500 hover:bg-blue-300 text-white font-bold py-1 px-1.5 border-orange-400 rounded-full absolute sm:right-1 -right-[0.8rem] ">
          <SearchIcon />
        </button>
      </div>
      {isListOpen && apiData.length > 0 && inputVal !== "" && (
        <ul className="absolute top-full ml-6 lg:ml-2 sm:ml-10 md:ml-10 lg:w-[70%] md:w-[60%] sm:w-[60%] bg-slate-100 rounded-b-md border border-orange-300">
          {apiData
            .filter((filters) => filters.title.toLowerCase().includes(inputVal))
            .map((dat) => (
              <li className="border-b border-orange-500 py-2 px-4" key={dat.id}>
                <Link to={`products/${dat.id}`}>
                  <div className="flex gap-5 max-h-[3.25rem] flex-1">
                    <img
                      className="bg-cover bg-center"
                      src={dat.thumbnail}
                      height={42}
                      width={64}
                      alt={dat.title}
                    />
                    <div className="flex flex-col w-full justify-center">
                      <p className="my-1 text-sm italic">{dat.title}</p>
                      <p className="text-sm text-gray-500">{dat.category}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
 
};

export default Search;


import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetch = (queryKey,apiUrl) =>{

    const fetchData = async() => {

        const res = await axios.get(apiUrl);
        return res.data.products
    }

    const {isLoading,error,data} = useQuery(
        {
        queryKey,
        queryFn:fetchData
    });

    return {isLoading,error,data}

}

export default useFetch
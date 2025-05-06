import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const StoreContext = createContext(null)


const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({})
    const url = "http://localhost:4000"
    const [token,setToken] = useState("");

    //we are making this so that the food menu items are called from the database and not from the assets folder.
    const[food_list,setFoodList] = useState([])

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if(token){
            await axios.post(url + "/api/cart/add", {itemId},{headers:{token}})
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if(token){
            await axios.post(url +"/api/cart/remove",{itemId},{headers:{token}})
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];

            }
        }
        return totalAmount;
    }

    const fetchFoodList = async()=>{
        const response = await axios.get(url + "/api/food/list");;
        setFoodList(response.data.data)
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get" ,{},{headers:{token}});
        setCartItems(response.data.cartData);
    }

    // when we reload the web page we dont get logout, to solve this i created this.
    useEffect(()=>{ 
        async function loadData(){
            await fetchFoodList();
            if(localStorage.getItem("token")){//if the token is already in the local storage at the time of reload it will take 
                setToken(localStorage.getItem("token"));//the token and set that token so that after reload we are still logged in.
                await loadCartData(localStorage.getItem("token")); 
            }
        }loadData();
    },[])

    const ContextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }

    return (
        <StoreContext.Provider value={ContextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
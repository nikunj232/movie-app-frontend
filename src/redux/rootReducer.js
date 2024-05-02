import { combineReducers } from "redux";
import authSlice from "./auth/slice";
import productSlice  from "./product/slice";
import movieSlice  from "./movie/slice";
import bookingSlice  from "./booking/slice";
import cartSlice  from "./cart/slice";

const rootReducer = {
    authSlice,
    cartSlice,
    productSlice,
    bookingSlice,
    movieSlice
}

export default rootReducer

import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"
import _ from "lodash"
import { axiosApi } from "../../helper/axiosApi.js"
import initialStates from "./state.js"

// ** get my booking
export const getMyBooking = ({page, limit}) => async (dispatch) => {
    // const { data, page } = data
    try {
        dispatch(setBookingState([
            {key: 'allBookingData.loading', value:true},
            {key: 'allBookingData.error', value:true}
        ]))
        const response = await axiosApi.get('bookings/get-my-booking-list', {
            params:{
                page, limit
            }
        })
        setTimeout(() => {
            dispatch(setBookingState([
                {key: 'allBookingData.loading', value:false},
                {key: 'allBookingData.data', value:response.data.data}
            ]))
        }, 500);
    } catch (error) {
        toast.error(error.response?.data.message?? "Something went wrong")
        dispatch(setBookingState([
            {key: 'allBookingData.loading', value: false},
            {key: 'allBookingData.data', value: null},
            {key: 'allBookingData.error', value: false}
        ]))
    }
}

export const bookingSlice = createSlice({
    name: 'booking',
    initialState: initialStates,
    reducers: {
        setBookingState: (state, { payload }) => {
            if (Array.isArray(payload)) {
                for (const obj of payload) {
                    if (obj.key === "allBookingData.data" && obj?.value?.page > 1) {
                        _.set(state, obj.key, {
                            ...state.allBookingData.data,
                            results:[
                                ...state.allBookingData?.data?.results,
                                ...obj.value.results
                            ]
                        })
                    }else{
                        _.set(state, obj.key, obj.value)
                    }
                }
            } else {
                _.set(state, payload.key, payload.value)
            }
        }
    }
})

const { reducer } = bookingSlice
export const { setBookingState } = bookingSlice.actions
export default reducer
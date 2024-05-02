
import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"
import _ from "lodash"
import { axiosApi } from "../../helper/axiosApi.js"
import initialStates from "./state.js"

// ** get my movie
export const getMyMovie = ({page, limit}) => async (dispatch) => {
    // const { data, page } = data
    try {
        dispatch(setMovieState([
            {key: 'allMovieData.loading', value:true},
            {key: 'allMovieData.error', value:true}
        ]))
        const response = await axiosApi.get('movies/get-my-movie-list', {
            params:{
                page, limit
            }
        })
        setTimeout(() => {
            dispatch(setMovieState([
                {key: 'allMovieData.loading', value:false},
                {key: 'allMovieData.data', value:response.data.data}
            ]))
        }, 500);
    } catch (error) {
        toast.error(error.response?.data.message?? "Something went wrong")
        dispatch(setMovieState([
            {key: 'allMovieData.loading', value: false},
            {key: 'allMovieData.data', value: null},
            {key: 'allMovieData.error', value: false}
        ]))
    }
}

export const movieSlice = createSlice({
    name: 'movie',
    initialState: initialStates,
    reducers: {
        setMovieState: (state, { payload }) => {
            if (Array.isArray(payload)) {
                for (const obj of payload) {
                    if (obj.key === "allMovieData.data" && obj?.value?.page > 1) {
                        _.set(state, obj.key, {
                            ...state.allMovieData.data,
                            results:[
                                ...state.allMovieData?.data?.results,
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

const { reducer } = movieSlice
export const { setMovieState } = movieSlice.actions
export default reducer
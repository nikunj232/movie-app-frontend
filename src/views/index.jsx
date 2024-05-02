import React, { useEffect, useState } from 'react'
import { dummyMoviePng } from '../assets/images/index'
import { axiosApi } from '../helper/axiosApi'
import ProfilePopup from '../components/ProfilePopup'
import { cartPng} from '../assets/images/index'
// import MovieCard from '../components/MovieCard'
import { getProfileStatus, isUserLoggedIn } from '../helper/authFunctions'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProfileUser } from '../redux/auth/slice'
import CustomLoader from '../components/CustomLoader'
import usePageScroll from '../utils/ePageScroll'

const Home = () => {
  const [searchText, setSearchText] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [addMovieCartData, setAddMovieCartData] = useState()
  const [moviesListData, setmoviesListData] = useState()
  const [moviesListError, setmoviesListError] = useState()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { x, y} = usePageScroll()

  const fetchMovie = async () => {
    setIsLoading(true)
    try {
      const moviesData = await axiosApi.get('/movies', {
        params:{
          search:searchText,
          page,
          limit
        }
      })

      setTimeout(() => {
        if (page==1) {
          setmoviesListData(moviesData?.data?.data)
        }else{
          let updatedMovieListData = {...moviesListData, results: [...moviesListData.results, ...moviesData?.data?.data?.results]}
          setmoviesListData(updatedMovieListData)
        }
        setIsLoading(false)
      }, 500);
    } catch (error) {
      setIsLoading(false)
      setmoviesListError(error)
    }
  }

  const updateMovieList = (movieId) =>{
    let tempMovieListData = [...moviesListData.results]
    let addedToCartMovieIndex = tempMovieListData.findIndex(movie => movie.id === movieId)
    tempMovieListData[addedToCartMovieIndex] = {...tempMovieListData[addedToCartMovieIndex], isAddedCart:true}
  }
  useEffect(() => {
    fetchMovie()
  }, [page])
  
  useEffect(() => {
    setPage(1)
  }, [searchText])
  
  useEffect(() => {
    if (!isLoading && moviesListData?.results?.length < moviesListData?.results?.totalResults) {
      fetchMovie()
    }
  }, [y])

  return (
    <>
      {isLoading && <CustomLoader/>}
      <div className='relative mx-auto overflow-y-auto'>
        <div className='container flex items-center justify-between px-6 mx-auto'>
          <h5 className='text-3xl font-semibold'>Movies <span className='text-lg'>(Total {moviesListData?.totalResults ?? 0} Results)</span></h5>
          <div className="relative max-w-xs transition-all bg-white border-2 rounded-lg shadow-theme hover:shadow-lg focus:border-dark-gray border-gray">
            <input
              onChange={(e) => {setSearchText(e.currentTarget.value); setPage(1)}}
              placeholder='Search'
              className="w-full px-4 py-2 bg-white border-none rounded-lg border-gray"
              id="usernameField"
              type="search"
            />
          </div>
        </div>
        {!!moviesListData?.results?.length
          ?<>
            <div className='px-6 container grid grid-cols-1 gap-8 px-4 py-10 mx-auto overflow-y-auto'>
              {
                moviesListData?.results.map((movie, i) => {
                  return (<>
                  <div className='!w-auto max-w-3xl hover:scale-[105%] w-auto transition-all duration-200 px-6 py-4 bg-white shadow-theme rounded-lg'>
                    <h2 className='text-xl font-bold mb-1'>
                      {movie.title}
                    </h2>
                    <span className='mb-16'>Genre: <b>{movie.genre}</b></span>
                    <div className='flex items-center gap-4 mt-5'>
                      <span>Show times: </span>
                      {
                        movie.showtimes.map(time => {
                          return (<>
                            <Link to={`/movie/${movie._id}/show/${time}`}>
                              <p className='px-4 py-1 border-[1.5px] border-black/50 text-black/50 font-semibold rounded'>{time}</p>
                            </Link>
                          </>)
                        })
                      }
                    </div>
                  </div>
                  </>
                  )
                })
              }
              {moviesListData?.totalPages > moviesListData?.page &&
                <div className='flex items-center justify-center col-span-4 mb-20'>
                  <button onClick={(e) => setPage(page+1)} className='btn-primary-outline font-semibold !rounded-full'>Load more</button>
                </div>
              }
            </div>
          </>
          :<p className='py-20 font-semibold text-center'>No data found!</p>
        }
      </div>
    </>
  )
}

export default Home
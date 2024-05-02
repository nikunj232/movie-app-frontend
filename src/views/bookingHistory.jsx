import React, { useEffect, useState } from 'react'
import usePageScroll from '../utils/ePageScroll'
import { axiosApi } from '../helper/axiosApi'
import Modal from 'react-modal'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


const BookingHistory = () => {
    const [searchText, setSearchText] = useState('')
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [isLoading, setIsLoading] = useState(false)
    const [myBookingListData, setMyBookingListData] = useState()
    const [myBookingListError, setMyBookingListError] = useState()
    const {x,y} = usePageScroll()
    
    const fetchBookingHistory = async () => {
        setIsLoading(true)
        try {
          const bookingData = await axiosApi.get('/bookings', {
            params:{
              search:searchText,
              page,
              limit
            }
          })
    
          setTimeout(() => {
            if (page==1) {
                setMyBookingListData(bookingData.data.data)
            }else{
              let updatedBookingListData = {...myBookingListData, results: [...myBookingListData.results, ...bookingData?.data?.data?.results]}
              setMyBookingListData(updatedBookingListData)
            }
            setIsLoading(false)
          }, 500);
        } catch (error) {
          setIsLoading(false)
          setMyBookingListError(error)
        }
    }
    
    useEffect(() => {
        if (!isLoading && myBookingListData?.results?.length < myBookingListData?.results?.totalResults) {
            fetchBookingHistory()
        }
    }, [y])
    
    useEffect(() => {
        fetchBookingHistory()
    }, [])
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        // setIsOpen(true);
        
MySwal.fire({
    title: <p>Hello World</p>,
    didOpen: () => {
      // `MySwal` is a subclass of `Swal` with all the same instance & static methods
      MySwal.showLoading()
    },
  }).then(() => {
    return MySwal.fire(<p>Shorthand works too</p>)
  })
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

    
    return (<>
        <div className='px-20'>
            <h5 className='mb-6 text-3xl font-semibold'>Booking history <span className='text-lg'>(Total {myBookingListData?.totalResults ?? 0} Results)</span></h5>
            <div className='flex gap-4'>
                {
                    myBookingListData?.results?.length
                    ?myBookingListData?.results.map(booking => {
                        console.log(booking, "booking dta");
                        return(<>
                                <div className='max-w-max'>
                                    <div className="bg-white max-w-max px-6 py-3 rounded-lg">
                                        <div className='text-based mb-2 min-w-2.5'>
                                            <span>Booked By : </span>
                                            <span className='font-semibold'> Nikunj</span>
                                        </div>
                                        <div className='text-based mb-2 min-w-2.5'>
                                            <span>Movie : </span>
                                            <span className='font-semibold'> {booking?.show?.movie?.title}</span>
                                        </div>
                                        <div className='text-based mb-2 min-w-2.5'>
                                            <span>Seats : </span>
                                            <span className='font-semibold'> {booking?.seats?.join(", ")}</span>
                                        </div>
                                        <div className='text-based mb-2 min-w-2.5'>
                                            <span>Show date : </span>
                                            <span className='font-semibold'> {booking?.show?.date}</span>
                                        </div>
                                        <div className='text-based mb-2 min-w-2.5'>
                                            <span>Show time : </span>
                                            <span className='font-semibold'> {booking.show.time}</span>
                                        </div>
                                        <div className='text-based mb-2 min-w-2.5'>
                                            <span>Booked on : </span>
                                            <span className='font-semibold'> {booking?.createdAt}</span>
                                        </div>
                                        {/* <hr /> */}
                                        <div className='flex justify-end'>
                                            <button className='lm-auto bg-red text-white px-4 py-2 font-semibold rounded' onClick={openModal}>Cancel ticket</button>
                                        </div>
                                    </div>
                                </div>
                        </>)
                    })
                    :<></>
                }

            </div>
        </div>

        <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <h4>Are yoou sure you want to cancel this ticket? </h4>
        </Modal>
    </>)
}

export default BookingHistory
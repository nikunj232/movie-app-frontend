import React, { useEffect, useState } from 'react'
import usePageScroll from '../utils/ePageScroll'
import { axiosApi } from '../helper/axiosApi'
import Modal from 'react-modal'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { toast } from 'react-toastify'
import CustomLoader from '../components/CustomLoader'
import { ticketSvg } from '../assets/images'
import moment from 'moment'

const MySwal = withReactContent(Swal)

const BookingHistory = () => {
    const [searchText, setSearchText] = useState('')
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleteBookingLoading, setIsDeleteBookingLoading] = useState(false)
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
    }, [page])
      
    useEffect(() => {
        setPage(1)
    }, [searchText])
      
    
    useEffect(() => {
        fetchBookingHistory()
    }, [])
    const [modalIsOpen, setIsOpen] = useState(false);

    const deleteTicket = async (bookingId) => {
        setIsDeleteBookingLoading(true)
        try{
            const deleteBookingData = await axiosApi.delete(`/bookings/${bookingId}`)
            setIsDeleteBookingLoading(false)
            setPage(1)
            setSearchText("")
            fetchBookingHistory()
            toast.success(res.data.message)
        }catch(error){
            setIsDeleteBookingLoading(false)
            toast.error(error.response?.data.message)
        }
    }
    function openModal(bookingId) {
        MySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No",
            reverseButtons: true
        }).then(data => {
            console.log(data)
            if(data.isConfirmed){
                deleteTicket(bookingId)
            }
        })
    }

    return (<>
        {isDeleteBookingLoading && <CustomLoader/>}
        <div className='px-20'>
            <h5 className='mb-6 text-3xl font-semibold'>Booking history <span className='text-lg'>(Total {myBookingListData?.totalResults ?? 0} Results)</span></h5>
            <div className='grid grid-cols-3 gap-4'>
                {
                    myBookingListData?.results?.length
                    ?myBookingListData?.results.map(booking => {
                        console.log(booking, "booking dta");
                        return(<>
                                <div className='max-w-max px-4 py-2 relative'>
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
                                        <div className='text-based mb-2 min-w-2.5 mb-6'>
                                            <span>Booked on : </span>
                                            <span className='font-semibold'> {moment(booking?.createdAt).format("YYYY/MM/DD  HH:mm")}</span>
                                        </div>
                                        {/* <hr /> */}
                                        <div className='flex justify-end'>
                                            <button className='lm-auto bg-red text-white px-4 py-2 font-semibold rounded' onClick={() => openModal(booking._id)}>Cancel ticket</button>
                                        </div>
                                    </div>
                                </div>
                        </>)
                    })
                    :<div className='flex items-center justify-center mx-auto'>
                        <p className='py-20 font-semibold text-center'>No data found!</p>
                    </div>
                }

            </div>
        </div>

        {/* <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <h4>Are yoou sure you want to cancel this ticket? </h4>
        </Modal> */}
    </>)
}

export default BookingHistory
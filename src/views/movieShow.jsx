import React, { useEffect, useState } from 'react'
import ReactDatePicker from 'react-datepicker';
// import {DatePicker} from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from 'react-router-dom/dist';
import { axiosApi } from '../helper/axiosApi';
import moment from 'moment';
import { editSvg } from '../assets/images';
import { toast } from 'react-toastify';

const theaterSeating = {
    "A": [1,2,0,0,3,4,5,6,7,8,9,10,0,0,11,12],
    "B": [1,2,0,0,3,4,5,6,7,8,9,10,0,0,11,12],
    "C": [1,2,0,0,3,4,5,6,7,8,9,10,0,0,11,12],
    "D": [1,2,0,0,3,4,5,6,7,8,9,10,0,0,11,12],
    "E": [1,2,0,0,3,4,5,6,7,8,9,10,0,0,11,12],
    "F": [1,2,0,0,3,4,5,6,7,8,9,10,0,0,11,12],
    "G": [1,2,0,0,3,4,5,6,7,8,9,10,0,0,11,12],
    "H": [1,2,0,0,3,4,5,6,7,8,9,10,0,0,11,12],
    "I": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
    "J": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
}
const MovieShow = () => {
    const { id, time } = useParams();
    const navigate = useNavigate();


    const currentDate = new Date()
    const [isBookingLoading, setIsBookingLoading] = useState(false);
    const [showDate, setShowDate] = useState(new Date());
    const [showData, setShowData] = useState();
    const [bookedSeat, setBookedSeat] = useState([]);
    const [noOfTicket, setNoOfTicket] = useState(0);
    const [isTicketEditing, setIsTicketEditing] = useState(true);
    const [selectedSeat, setSelectedSeat] = useState([]);
    
    useEffect(() => {
        console.log(id, time, "time and id");
    }, [id, time])
    
    const getShowData = async () =>{
        const res = await axiosApi.put(`movies/${id}/show`, {
            showtime: time,
            date: moment(showDate).format("YYYY-MM-DD")
        })
        setShowData(res.data.showData)
        setBookedSeat(res.data.bookedSeat)
        console.log(res);
    }

    useEffect(() => {
        getShowData()
    }, [showDate])
    
    const makeAutoSeatSelect = (row, seatIndex) => {
        if (noOfTicket) {
            let tempSelectedSeat = selectedSeat.length < noOfTicket ? [...selectedSeat] : []
            let tempSeatIndex = seatIndex
            let seatRowArray = theaterSeating[row]
            // console.log(tempSeatIndex, tempSelectedSeat.length, tempSelectedSeat.length < noOfTicket, seatRowArray.length > tempSeatIndex , !bookedSeat.includes(row+seatRowArray[tempSeatIndex]), "temp seat index");
            while (tempSelectedSeat.length < noOfTicket && seatRowArray.length > tempSeatIndex && !bookedSeat.includes(row+seatRowArray[tempSeatIndex])) {
                console.log(seatRowArray[tempSeatIndex], "is seat number or space");
                
                if (seatRowArray[tempSeatIndex]) {
                    let seatNumber = row+seatRowArray[tempSeatIndex]
                    tempSelectedSeat = [...tempSelectedSeat, seatNumber]
    
                    
                }
                tempSeatIndex ++ 
            }
            
            setSelectedSeat(tempSelectedSeat)
            
        } else {
            setSelectedSeat([...selectedSeat, row+theaterSeating[row][seatIndex]])
            
        }
    }

    useEffect(() => {
        console.log(selectedSeat, "selectedSeat");
    }, [selectedSeat])
    
    const bookSeat = async () => {
        setIsBookingLoading(true)
        try {
            const res = await axiosApi.post(`bookings`, {
                show: showData._id,
                seats: selectedSeat
            })
            console.log(res.data);
            toast.success(res.data.message)
            setIsBookingLoading(true)
            navigate('/')
            
        } catch (error) {
            toast.error(error.response?.data.message)
            setIsBookingLoading(true)
        }
    }
    return (<>
        <div className='flex items-strech justify-between px-24 mb-8'>
            <div className='rounded bg-white px-4 py-2 mr-4'>
                <div>Movie : <b>{showData?.movie?.title ?? "______"}</b></div>
                <div>Show time  : <b>{showData?.time ?? "HH:MM"}</b></div>
                <div>Total Available Seats  : <b>{showData?.available_seats ?? "0"}</b></div>
            </div>
            <div className='ml-auto rounded bg-white px-4 py-2 max-w-max'>
                <p className='text-sm mb-4'>How many seat you want to book!</p>
                {
                    isTicketEditing
                    ?<div className='flex gap-2'>
                        <input className='text-sm    border border-black rounded px-3' type="text" onChange={(event) => setNoOfTicket(event.target.value)} placeholder='Enter No of ticket' name="" id="ticketEdit" />
                        <button defaultValue={noOfTicket} onClick={() => setIsTicketEditing(false)} className='px-3 font-semibold py-1 rounded-md text-xs border bg-black text-white'>done</button>
                    </div>
                    :<div className='gap-4 flex'>
                        <p>
                            No of ticket : <b>{noOfTicket}</b>
                        </p>
                        <button onClick={() => setIsTicketEditing(true)} className=' border border-black p-1 rounded !bg-black text-white'>
                            <img className='w-4 ' src={editSvg} alt="" />
                        </button> 
                    </div>
                }
            </div>
            <div className='rounded bg-white px-4 py-2 max-w-max ml-4'>
                <b>Date :</b> 
                <div className='border rounded px-4 py-1'>
                    <ReactDatePicker minDate={currentDate} selected={showDate} onChange={(date) => setShowDate(date)} />
                </div>
                <div className='flex font-smibold'></div>
            </div>
        </div>
        <div className='px-12 py-4 pb-40'>
            <div className='max-w-max flex flex-col-reverse mx-auto'>
                    {
                        Object.keys(theaterSeating).map(row => {
                            return(<>
                                <div className='flex !mb-6 gap-2'>
                                    <span className='font-semibold w-10'>{row} :</span>
                                    {/* <td className='p-1 border'>1</td> */}
                                {
                                    theaterSeating[row].map((seatNumber,i) => {

                                        return (<>
                                            {
                                                seatNumber
                                                ?<label htmlFor={row+seatNumber} className='seat-checkbox text-center w-10 h-6 px-2'>
                                                    <input disabled={bookedSeat.includes(row+seatNumber)} checked={selectedSeat.includes(row+seatNumber)} onChange={() => makeAutoSeatSelect(row, i)} type="checkbox" className='' name={row+seatNumber} id={row+seatNumber} />
                                                    <span className={`${seatNumber ? 'border' : ''} text-xs p-2 m-2`}>
                                                        {seatNumber ? seatNumber : ''}
                                                    </span>
                                                </label>
                                                :<label htmlFor={row+seatNumber} className='seat-checkbox text-center w-10 h-6 px-2'>
                                                    
                                                </label>
                                            }
                                        </>)
                                    })
                                }
                                </div>
                            </>)
                        })
                    }
            </div>
            <div className='w-100 max-w-max mt-2 flex justify-between mx-auto text-black'>
                All the eyes facing this side!
            </div>
        </div>
        {
            selectedSeat.length > 0
            ?<div className='fixed bottom-10 left-1/2 transform -translate-x-1/2 max-w-max mx-auto bg-white px-10 py-4'>
                <div className='flex items-center gap-6'>
                    <p className='w-80'>Please click on book now to book you selected seats!</p>
                    <button className='px-4 py-2 bg-red text-white rounded-lg' onClick={bookSeat}>Book Now</button>

                </div>
            </div>
            :<></>
        }
    </>
    )
}

export default MovieShow
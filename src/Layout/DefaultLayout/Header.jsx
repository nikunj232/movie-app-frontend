import React, { useEffect, useState } from "react";
import ProfilePopup from "../../components/ProfilePopup";
import { cartPng, mainLogo, mainLogoSvg } from "../../assets/images/index";
import { isUserLoggedIn, getAccessToken, userLogout, removeAccessToken } from '../../helper/authFunctions.js'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setAuthState } from "../../redux/auth/slice";

const Header = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { profileData, profileDataError, profileDataLoading } = useSelector((store) => ({
    profileData: store.authSlice.profileData.data,
    profileDataLoading: store.authSlice.profileData.loading,
    profileDataError: store.authSlice.profileData.error
  }))

  useEffect(() => {
    console.log(profileData);
  }, [profileData])
  

  const makeUserLogout = () => {
    removeAccessToken()
    // dispatch(logoutUser())
    dispatch(setAuthState([
      {key: 'loginData', value:{}}
    ]))
    navigate('/')
  }
  
  return (
    <header className="z-[999] container sticky flex items-center justify-between px-8 py-3 mx-auto mt-4 mb-10 bg-white rounded-md top-5 shadow-theme">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center justify-start gap-8">
          <Link to="/" className="text-xl font-semibold">
            <img className="w-30 h-7" src={mainLogoSvg} alt="main logo" />
          </Link>
          <ul className="flex items-center justify-start font-semibold">
            {
              (isUserLoggedIn() && profileData?.user) &&
              <li className="px-4 border-l-2 border-dark-gray">
                <Link className="text-sm hover:underline" to="booking-history">Booking History</Link>
              </li>
            }
          </ul>
        </div>
        <div className="flex items-center justify-end gap-4">
          {
            (!profileDataLoading && !profileData?.user)
            ?<></>
            :<div className="flex items-center justify-end">
              {
                (isUserLoggedIn() && profileData?.user)
                  ? <>
                    <button className='mr-4 flex items-center justify-end gap-4'>
                      <div className='flex gap-2 block'>
                        <p className='text-sm font-medium text-end'>{profileData.user?.firstname} </p>
                        <p className='text-sm font-medium text-end'>{profileData.user?.lastname}</p>
                        {/* <p className='text-xs font-medium text-end'>{profileData.user?.email}</p> */}
                      </div>
                      <span className='flex items-center justify-center w-12 h-12 font-bold rounded-full bg-gray'>{String(profileData.user?.firstname).slice(0, 1)}</span>
                    </button>
                    <button onClick={makeUserLogout} className="pl-4 text-base font-semibold border-l-2 hover:underline border-dark-gray">Log Out</button>
                  </>
                  : <>
                    <Link className="border-l-2 btn-primary border-dark-gray" to="/login">Log In</Link>
                  </>
              }
            </div>
          }
        </div>
      </div>
    </header>
  );
};

export default Header;

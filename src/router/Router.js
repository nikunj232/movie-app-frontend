import React from 'react';
import { BrowserRouter as Router, Route, Routes, createBrowserRouter } from 'react-router-dom';
import Login from '../views/authentication/Login';
import Signup from '../views/authentication/Signup';
import Home from '../views';
import VerifyEmailToken from '../views/authentication/VerifyEmailToken';
//  import ProtectedRoute from './ProtectedRoute';
import AuthRoute from './AuthRoute';
import { isUserLoggedIn } from '../helper/authFunctions';
import VerifyEmail from '../components/VerifyEmail';
import ProtectedRoute from './ProtectedRoute';
import DefaultLayout from '../Layout/DefaultLayout/index';
import MovieShow from '../views/movieShow';
import BookingHistory from '../views/bookingHistory';

const AppRouter = () => {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<DefaultLayout/>}>
          <Route exact path="/"  element={<Home/>}/>
          <Route element={<AuthRoute/>}>
            <Route exact path="/login" element={<Login/>} />
            <Route exact path="/signup" element={<Signup/>} />
          </Route>
          <Route element={<ProtectedRoute/>}>
            <Route exact path="/movie/:id/show/:time" element={<MovieShow/>} />
            <Route exact path="/booking-history" element={<BookingHistory/>} />
          </Route>
          <Route exact path="/verify-email" element={<VerifyEmailToken/>} />

        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;

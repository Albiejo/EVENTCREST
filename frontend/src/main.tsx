import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  
} from "react-router-dom";
import { Provider } from 'react-redux';
import {store,persistor} from './redux/store.ts'
import { PersistGate } from 'redux-persist/integration/react';

import AdminApp from './pages/admin/AdminApp.tsx'
import Dashboard from './pages/admin/Dahboard.tsx';
import AdminLogin from './components/admin/Login.tsx'
import AdminPrivateRoute from './components/admin/AdminPrivateRoute.tsx';
import Wallet from './pages/admin/Wallet.tsx';


import HomePage from './pages/HomePage.tsx'
import ForgotPassword from './components/ForgotPassword.tsx';
import ResetPassword from './components/ResetPassword.tsx'

import UserLoginForm from './components/user/Login.tsx';
import UserSignupForm from './components/user/Signup.tsx'
import VerifyEmail from './components/VerifyEmail.tsx';
import UsersList from './pages/admin/UsersList.tsx';
import UserPrivateRoute from './components/user/UserPrivateRoute.tsx';
import UserSidebar from './components/user/Profile/Sidebar.tsx';
import ChangeUserPassword from './components/user/Profile/ChangePassword.tsx';
import Favourites from './components/user/Profile/Favorites.tsx';

import VendorLoginForm from './components/vendor/Login.tsx';
import VendorSignupForm from './components/vendor/Signup.tsx';
import VendorApp from './pages/vendor/VendorApp.tsx';
import VendorsList from './pages/admin/VendorsList.tsx';
import VendorTypes from './pages/admin/VendorTypes.tsx';
import VendorPrivateRoute from './components/vendor/VendorPrivateRoute.tsx';
import VendorProfile from './components/admin/vendorList/VendorProfile.tsx';
import VendorProfilePage from './pages/vendor/Profile.tsx';
import CreatePost from './components/vendor/CreatePost.tsx';
import VendorListing from './pages/VendorListing.tsx';
import ChangePassword from './components/vendor/ChangePassword.tsx';
import EditProfileCard from './components/vendor/EditProfileCard.tsx';
import Profile from './pages/user/Profile.tsx';
import LandingPage from './components/Home/Landingpage.tsx';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const router = createBrowserRouter(
  createRoutesFromElements(<>
    <Route path="/" element={<App/>}>
    <Route index={true}  path="/" element={<HomePage />} />
      <Route path="/login" element={<UserLoginForm />} />
      <Route path="/signup" element={<UserSignupForm />} />
      <Route path="/verify" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path='/sample' element={<LandingPage/>}/>
      {/* User Private Routes */}
      <Route path="" element={<UserPrivateRoute/>}>
      <Route path="/profile" element={<UserSidebar/>}/>
      <Route path="/vendors" element={<VendorListing/>}/>
      <Route path="/viewVendor" element={<VendorProfilePage/>}/>
      <Route path='/profile/change-password' element={<ChangeUserPassword/>}/>
      <Route path='/profile/Favorites' element={<Favourites/>}/>
      </Route>
    </Route>

    <Route path="/admin" element={<AdminApp/>}>
      <Route index={true} path="/admin" element={<AdminLogin />} />
      {/* Admin Private Routes */}
      <Route path="" element={<AdminPrivateRoute/>}>
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/vendors" element={<VendorsList />} />
      <Route path="/admin/vendor-types" element={<VendorTypes />} />
      <Route path="/admin/users" element={<UsersList />} />
      <Route path="/admin/vendor" element={<VendorProfile />} />
      <Route path="/admin/wallet" element={<Wallet />} />
      </Route>
    </Route>


    <Route path="/vendor" element={<VendorApp/>}>
      <Route index={true} path="/vendor" element={<HomePage />} />
      <Route path="/vendor/login" element={<VendorLoginForm />} />
      <Route path="/vendor/signup" element={<VendorSignupForm />} />
      <Route path="/vendor/verify" element={<VerifyEmail />} />
      <Route path="/vendor/forgot-password" element={<ForgotPassword />} />
      <Route path="/vendor/reset-password" element={<ResetPassword />} />
      {/* vendor Private Routes */}
      <Route path="" element={<VendorPrivateRoute/>}></Route>
      <Route path="/vendor/vendors" element={<VendorListing/>}/>
      <Route path='/vendor/profile' element={<VendorProfilePage/>}/>
      <Route path='/vendor/Create-post' element={<CreatePost/>} />
      <Route path="/vendor/change-password" element={<ChangePassword />} />
      <Route path="/vendor/edit-profile" element={<EditProfileCard />} />
    </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
     <PersistGate persistor={persistor}>
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>
  </PersistGate>
  </Provider>
)

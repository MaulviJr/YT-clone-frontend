import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './store/store.js'
import { Provider } from 'react-redux'
import { createBrowserRouter, Router } from 'react-router-dom'
import LoginPage from './pages/users/LoginPage.jsx'
import SignUpPage from './pages/users/SignUpPage'
import AuthLayout from './components/AuthLayout'
import { RouterProvider } from 'react-router'
import HomePage from './pages/users/HomePage'
import MyProfile from './pages/users/MyProfile'
import UploadVideo from './pages/videos/UploadVideo'
import {
  ProfileHome,
  ProfileAbout,
  ProfileCommunity,
  ProfilePlaylist,
  ProfileVideo
}
from './components/profileComponents/profCompIndex.js'

import {
  CommunityHome,
  UploadCommunity
} from './pages/community/commIndex.js'

import VideoPlay from './pages/videos/VideoPlay'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '/',
        element: 
        <AuthLayout authentication={true}>
        <HomePage/> 
        </AuthLayout>
      },
      {
        path: '/login',
        element: (
        <AuthLayout authentication={false}>
          <LoginPage />
        </AuthLayout>
        )
      },
      {
        path: '/signup',
        element: (
          <AuthLayout authentication={false}>
           <SignUpPage/>
          </AuthLayout>
        )
      }
      ,
      {
        path: '/profile/:username?',
        element: (
          <AuthLayout authentication={true}>
           <MyProfile/>
          </AuthLayout>
        ),
        children: [
          { index: true, element: <ProfileHome /> },
    { path: 'videos', element: <ProfileVideo /> },
    { path: 'about', element: <ProfileAbout /> },
    { path: 'community', element: <ProfileCommunity /> },
    { path: 'playlists', element: <ProfilePlaylist /> },

        ]
      },
      {
         path: '/watch/:videoId',
        element: (
          <AuthLayout authentication={true}>
           <VideoPlay/>
          </AuthLayout>
        )
      },
      {
        path: '/upload',
        element: (
          <AuthLayout authentication={true}>
           <UploadVideo/>
          </AuthLayout>
        )
      },
      {
          path: '/community',
        element: (
          <AuthLayout authentication={true}>
           <CommunityHome/>
          </AuthLayout>
        )
      },
      {
          path: '/upload-community',
        element: (
          <AuthLayout authentication={true}>
           <UploadCommunity/>
          </AuthLayout>
        )
      },


    ]

  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)

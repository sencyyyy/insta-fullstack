import Profile from './pages/Profile'
import ProfileEdit from './pages/ProfileEdit'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import Newpost from './components/Newpost'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from "react"

function App() {
  const API_URL = "http://localhost:1234/api"
  const [sessionToken, setSessionToken] = useState(() => localStorage.getItem("sessionToken") || "")

  function updateSessionToken(token) {
    setSessionToken(token || "")
    if (token) {
      localStorage.setItem("sessionToken", token)
    } else {
      localStorage.removeItem("sessionToken")
    }
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/feed' />} />
          <Route path='/users/:user' element={<Profile apiUrl={API_URL} sessionToken={sessionToken} />} />
          <Route path='/newpost' element={<Newpost sessionToken={sessionToken} apiUrl={API_URL} />} />
          <Route path='/register' element={<Register sessionToken={sessionToken} apiUrl={API_URL} />} />
          <Route path='/profile' element={<Profile sessionToken={sessionToken} apiUrl={API_URL} />} />
          <Route path='/profile/edit' element={<ProfileEdit sessionToken={sessionToken} apiUrl={API_URL} />} />
          <Route path='/login' element={<Login tokenAccess={updateSessionToken} apiUrl={API_URL}/>} />
          <Route path='/feed' element={<Feed sessionToken={sessionToken} apiUrl={API_URL} />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

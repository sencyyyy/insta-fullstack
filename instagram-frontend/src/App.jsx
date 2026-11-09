import Profile from './pages/Profile'
import ProfileEdit from './pages/ProfileEdit'
import Login from './pages/Login'
import Feed from './pages/Feed'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useRef } from "react"

function App() {
  const API_URL = "http://localhost:1234/api"
  const [sessionToken, setSessionToken] = useState("")

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/profile' element={<Profile sessionToken={sessionToken} apiUrl={API_URL} />} />
          <Route path='/profile/edit' element={<ProfileEdit sessionToken={sessionToken} apiUrl={API_URL} />} />
          <Route path='/login' element={<Login tokenAccess={setSessionToken} apiUrl={API_URL}/>} />
          <Route path='/feed' element={<Feed sessionToken={sessionToken} apiUrl={API_URL} />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

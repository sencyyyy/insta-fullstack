import Profile from './pages/Profile'
import Login from './pages/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { useState, useRef } from "react"

function App() {
  const API_URL = "http://localhost:1234/api"
  const [sessionToken, setSessionToken] = useState("")

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/profile' element={<Profile />} />
          <Route path='/login' element={<Login tokenAccess={setSessionToken} apiUrl={API_URL}/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

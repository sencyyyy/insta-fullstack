import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'

import { Link } from 'react-router-dom'

import { useState, useEffect } from 'react'

function NavBar({ sessionToken, apiUrl }) {
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    async function fetchUserData() {
      if (!sessionToken) {
        setUserInfo({})
        return
      }
      const response = await fetch(`${apiUrl}/user?token=${sessionToken}`)
      if (!response.ok) return
      const data = await response.json()
      setUserInfo(data)
    }

    fetchUserData()
  }, [sessionToken, apiUrl])

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
      <Container className='d-inline-flex justify-content-between'>
        <div className='d-inline-flex'>
        <Navbar.Brand href="/feed">Instagram</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link className='nav-link'>Feed</Link>
            <Link className='nav-link' to='/newpost'>Novo post</Link>
          </Nav>
        </Navbar.Collapse>
        </div>
        <div className='d-inline-flex'>
          <img width={32} height={32} src={userInfo.profile_picture ? userInfo.profile_picture : 'https://placehold.co/32x32'} className='rounded-circle mx-3' />

            <NavDropdown title={userInfo.user} id="basic-nav-dropdown">
              
                <Link className='dropdown-item' to='/profile'>Perfil</Link>
              <NavDropdown.Divider />
              <Link className='dropdown-item text-danger' onClick={() => {
                localStorage.clear()
                window.location.reload()
              }}>
                Sair
              </Link>
            </NavDropdown>
        </div>
      </Container>
    </Navbar>
    )
}

export default NavBar
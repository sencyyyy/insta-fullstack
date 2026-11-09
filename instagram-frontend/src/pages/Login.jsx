import Form from "react-bootstrap/Form"
import Button from 'react-bootstrap/Button'

import  { Navigate, Link } from "react-router-dom"
import { useState } from "react"


function Login({ tokenAccess, apiUrl }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loginError, setLoginError] = useState(false)
    const [feedRedirect, setFeedRedirect] = useState(<></>)
    
    async function authenticate() {
        try {
            setLoginError(false)
            const response = await fetch(`${apiUrl}/users/login?user=${username}&password=${password}`)
            const data = await response.json()
            tokenAccess(data)
            setFeedRedirect(<Navigate to={"/feed"} />)
        } catch(err) {
            setLoginError(true)
            console.error(err)
        }
    }
    
    return (
        <>
        <div className="vh-100 container-sm d-flex justify-content-center align-items-center">
            <div className="w-50 p-3 border rounded" >
                <Form onSubmit={(e) => {
                    e.preventDefault()
                    authenticate()
                }}>
                    <Form.Group className="mb-3" controlId="formUser">
                        <Form.Label>Usuário</Form.Label>
                        <Form.Control value={username} onInput={(e) => setUsername(e.target.value)} type="text" placeholder="Insira o usuário" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control value={password} onInput={(e) => setPassword(e.target.value)} type="password" placeholder="Insira a senha" />            
                    </Form.Group>
                    <p className="text-danger">
                        {loginError ? "Credenciais inválidas!" : ""}
                    </p>
                    <Button variant="primary" type="submit">Login</Button>
                    <p className="mt-2">Nao tem conta? <Link to="/register">registre-se</Link></p>
                </Form>
            </div>
            {feedRedirect}
        </div>
        </>
    )
}

export default Login
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Navigate } from 'react-router-dom'

import { useState } from 'react'

function Register({ apiUrl }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [redirect, setRedirect] = useState(<></>)
    const [error, setError] = useState(null)

    async function submitRegistration() {
        try {
            const response = await fetch(`${apiUrl}/users/new`, {
                method: "POST",
                body: JSON.stringify({
                    user: username,
                    password: password
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            return true
        } catch (err) {
            console.error(err)
            setError(err)
            return false
        }
    }

    return (
        <>
        <div className="vh-100 container-sm d-flex justify-content-center align-items-center">
            <div className="w-50 p-3 border rounded" >
                <Form onSubmit={(e) => {
                    e.preventDefault()
                    if (submitRegistration()) {
                        setRedirect(<Navigate to="/login" />)
                    }
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
                        {error ? "Credenciais inválidas!" : ""}
                    </p>
                    <Button variant="primary" type="submit">Registrar</Button>
                </Form>
            </div>
            {redirect}
        </div>
        </>
    )
}

export default Register
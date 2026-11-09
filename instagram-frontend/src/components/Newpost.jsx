import { useState, useEffect } from "react"
import NavBar from "./NavBar"

import Form from "react-bootstrap/Form"
import Button from 'react-bootstrap/Button'
import { Navigate } from "react-router-dom"


function Newpost({ sessionToken, apiUrl }) {
    const [postTitle, setPostTitle] = useState("")
    const [postImage, setPostImage] = useState('')
    const [postDescription, setPostDescription] = useState("")
    const [redirect, setRedirect] = useState(<></>)
    const [userInfo, setUserInfo] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function getUserInfo() {
            const response = await fetch(`${apiUrl}/user?token=${sessionToken}`)
            const data = await response.json()
            setUserInfo(data)
        }
        getUserInfo()
    }, [sessionToken, apiUrl])

    async function sendPost() { 
        try {
            const response = await fetch(`${apiUrl}/posts`, {
                method: "POST",
                body: JSON.stringify({
                    token: sessionToken,
                    title: postTitle,
                    image: postImage,
                    description: postDescription,
                    owner_id: userInfo.id
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
        <NavBar sessionToken={sessionToken} apiUrl={apiUrl} />
        <div className="vh-100 container-sm d-flex justify-content-center align-items-center">
            <div className="w-50 p-3 border rounded" >
                <Form onSubmit={(e) => {
                    e.preventDefault()
                    if (sendPost()) setRedirect(<Navigate to='/feed' />)
                }}>
                    <Form.Group className="mb-3" controlId="formUser">
                        <Form.Label>Imagem</Form.Label>
                        <Form.Control value={postImage} onInput={(e) => setPostImage(e.target.value)} type="text" placeholder="Link da imagem" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Título</Form.Label>
                        <Form.Control value={postTitle} onInput={(e) => setPostTitle(e.target.value)} type="text" placeholder="Título do poste" />            
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control value={postDescription} onInput={(e) => setPostDescription(e.target.value)} type="text" placeholder="Descricao do post" />            
                    </Form.Group>
                    <p className="text-danger">
                        {error ? "Ocorreu um Erro" : ""}
                    </p>
                    <Button variant="primary" type="submit">Postar</Button>
                </Form>
            </div>
            {redirect}
        </div>
        </>
    )
}

export default Newpost
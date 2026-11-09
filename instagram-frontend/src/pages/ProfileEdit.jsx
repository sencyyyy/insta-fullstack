import { useState, useEffect } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Navigate } from 'react-router-dom'

function ProfileEdit({ sessionToken, apiUrl  }) {
    async function submitProfileChanges(changes) {
        changes['token'] = sessionToken
        const response = fetch(`${apiUrl}/users`, {
            method: "PATCH",
            body: JSON.stringify(changes),
            headers: {
                "Content-Type": "application/json"
            }
            
        })
    }

    const [userInfo, setUserInfo] = useState({})
    const [changedUser, setChangedUser] = useState("")
    const [changedName, setChangedName] = useState("")
    const [changedBio, setChangedBio] = useState("")
    const [changedLink, setChangedLink] = useState("")
    const [changedPicture, setChangedPicture] = useState("")

    const [redirect, setRedirect] = useState(<></>)

    useEffect(() => {
        async function getUserInfo() {
            const response = await fetch(`${apiUrl}/user?token=${sessionToken}`)
            const data = await response.json()
            console.log(data)
            setUserInfo(data) 
        }
        getUserInfo()
    }, [sessionToken, apiUrl])

    return (
        <>
        <div className='container-sm mt-3'>
            <h2>Editar Perfil</h2>
            <h4>{userInfo.user}</h4>
            <Form onSubmit={(e) => {
                e.preventDefault()
                let changes = {}
                if (changedUser != "") changes['user'] = changedUser
                if (changedName != "") changes['name'] = changedName
                if (changedBio != "") changes['bio'] = changedBio
                if (changedLink != "") changes['bio_link'] = changedLink
                if (changedPicture != "") changes['profile_picture'] = changedPicture
                submitProfileChanges(changes)
                setRedirect(<Navigate to='/profile' />)
            }}>
                    <Form.Group className="mb-3" controlId="formUser">
                        <Form.Label>Usuário</Form.Label>
                        <Form.Control  type="text" placeholder={userInfo.user} value={changedUser} onChange={(e) => setChangedUser(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control type="text" placeholder={userInfo.name} value={changedName} onChange={(e) => setChangedName(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBio">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder={userInfo.bio} value={changedBio} onChange={(e) => setChangedBio(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formLink">
                        <Form.Label>Link</Form.Label>
                        <Form.Control type="text" placeholder={userInfo.bio_link} value={changedLink} onChange={(e) => setChangedLink(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formProfilePicture">
                        <Form.Label>Foto de perfil</Form.Label>
                        <Form.Control type="text" value={changedPicture} onChange={(e) => setChangedPicture(e.target.value)} />
                    </Form.Group>

                    <Button variant="primary" type="submit">Salvar</Button>
                    {redirect}
                </Form>
        </div>
        </>
    )
}

export default ProfileEdit
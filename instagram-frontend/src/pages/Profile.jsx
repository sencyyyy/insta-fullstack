import './Profile.css'

import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

function Profile({sessionToken, apiUrl}) {
    const [userInfo, setUserInfo] = useState({})
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
        <div className="container-fluid d-flex justify-content-center">
            <div id="conteudo" className="sm:container mt-3" style={{maxWidth: "1000px"}}>
                <div id="cabecalho">
                    <div id="fotodeperfil">
                        <div id="fotobox">
                            <img src='https://placehold.co/200x200' alt="Foto de Perfil" />
                        </div>
                    </div>
                    <div id="textodeperfil">
                        <h2 id="username">{userInfo.user}</h2>

                        <b id="nomedeperfil">
                            {userInfo.name}
                        </b>    

                        <div id="seguidores">
                            <span id="seguidores-texto"><b>{userInfo.followers}</b> Seguidores</span>
                            <span><b>{userInfo.following}</b> Seguindo</span>
                        </div>

                        <div id="bio">
                            {!userInfo.bio ? "" : userInfo.bio.split(/\r?\n/).map((l) => (
                                <div id='p'>{l}</div>
                            ))}
                            <a id="biolinnk" href={`https://${userInfo.bio_link}`}>
                                
                                {userInfo.bio_link ?
                                    <svg aria-label="Ícone de link" className="x1lliihq x1n2onr6 x7l2uk3" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><title>Ícone de link</title><path d="m9.726 5.123 1.228-1.228a6.47 6.47 0 0 1 9.15 9.152l-1.227 1.227m-4.603 4.603-1.228 1.228a6.47 6.47 0 0 1-9.15-9.152l1.227-1.227" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="8.471" x2="15.529" y1="15.529" y2="8.471"></line></svg>
                                    
                                : ""}
                                {userInfo.bio_link ? userInfo.bio_link : ""}
                            </a>
                        </div>

                        {/* <button id="followb">Seguir</button> */}
                        <button
                            className='btn btn-secondary'
                            onClick={() => setRedirect(<Navigate to='/profile/edit' />)}
                        >
                            Editar perfil
                        </button>
                        {redirect}

                    </div>
                </div>
                {/* <div id="destaques">
                    <GenDestaques quantos={10} />
                </div>
                <Feed images={10000} /> */}
            </div>
        </div>
        </>
    )
}

export default Profile
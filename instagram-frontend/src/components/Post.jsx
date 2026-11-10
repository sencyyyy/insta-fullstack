import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Post({ sessionToken, apiUrl, ownerId, title, image, description, likes, postId }) {
    const navigate = useNavigate()
    const [likeCount, setLikeCount] = useState(likes)
    const [ownerName, setOwnerName] = useState("")
    const [ownerPicture, setOwnerPicture] = useState(null)
    const [error, setError] = useState(null)


    useEffect(() => {
        async function getOwnerName() {
            const response = await fetch(`${apiUrl}/users/${ownerId}`)
            if (!response.ok) return
            const data = await response.json()
            setOwnerName(data.user)
            setOwnerPicture(data.profile_picture)
        }

        getOwnerName()

    }, [apiUrl, ownerId])

    async function likePost() {
        try {
            const response = await fetch(`${apiUrl}/posts/${postId}/like`, {
                method: "POST",
                body: JSON.stringify({ token: sessionToken }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (!response.ok) throw new Error("failed to like post")
            setLikeCount((count) => count + 1)
        } catch (err) {
            console.error(err)
            setError(err)
        }
    }

    return(
        <div className="container-fluid d-flex flex-column align-items-center my-3">
            <div className="w-50">
                <div className="d-inline-flex w-75 justify-content-between" id="header">
                    <div className="d-inline-flex">
                        <img width={32} height={32} src={ownerPicture ? ownerPicture : 'https://placehold.co/32x32'} className="rounded-circle me-2" />
                        <b className="me-2" onClick={() => navigate(`/users/${ownerName}`)}>{ownerName}</b>
                        <div className="text-body-tertiary"><b> • há 2 dias</b></div>
                    </div>
                    <div>
                        ...
                    </div>
                </div>
                <img className="w-75 rounded" src={image} />
                <div className="w-75">
                    <b>{title}</b>
                    <p>{description}</p>
                    <div className="d-inline-flex">
                        <button className="d-inline-flex bg-transparent border-0" onClick={likePost}>
                        <div className="me-1">
                            <svg aria-label="Curtir" className="x1lliihq x1n2onr6 xyb1xck" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Curtir</title><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>
                        </div>
                        <b>{likeCount}</b>
                        </button>
                    </div>
                    {error ? <p className="text-danger">Não foi possível curtir o post.</p> : ""}
                </div>
            </div>
            
        </div>
    )
}

export default Post

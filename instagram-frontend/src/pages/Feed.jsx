import Post from '../components/Post'
import NavBar from '../components/NavBar'

import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

function Feed({ sessionToken, apiUrl }) {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)


    useEffect(() => {
        if (!sessionToken) return
        async function getPosts() {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(`${apiUrl}/posts?token=${sessionToken}`)
                if (!response.ok) throw new Error("failed to load feed")
                const data = await response.json()
                setPosts(data)
            } catch (err) {
                console.error(err)
                setError(err)
            } finally {
                setLoading(false)
            }
        }
    
        getPosts()

    }, [apiUrl, sessionToken])
    

    if (!sessionToken) {
        return (
            <Navigate to="/login" />
        )
    }

    if (loading) {
        return (
            <h1>Carregando...</h1>
        )
    }

    return (
        <>
        <NavBar sessionToken={sessionToken} apiUrl={apiUrl} />
        <div className="container-sm" >
            {error ? <p className="text-danger">Não foi possível carregar o feed.</p> : ""}
            {posts.map((p) => (
                <Post
                    key={p.id}
                    sessionToken={sessionToken}
                    apiUrl={apiUrl}
                    title={p.title}
                    description={p.description}
                    ownerId={p.owner_id}
                    image={p.image}
                    likes={p.likes}
                    postId={p.id}
                / >
            ))}
        </div>
        </>
    )
}

export default Feed
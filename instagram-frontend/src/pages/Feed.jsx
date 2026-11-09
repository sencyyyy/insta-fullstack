import Post from '../components/Post'
import NavBar from '../components/NavBar'

import { useState, useEffect } from 'react'

function Feed({ sessionToken, apiUrl }) {
    // if (sessionToken == "") {
    //     return (
    //         <h1>Por favor faça login!</h1>
    //     )
    // }

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)


    useEffect(() => {
        async function getPosts() {
            const response = await fetch(`${apiUrl}/posts?token=${sessionToken}`)
            const data = await response.json()
            console.log(data)
            setPosts(data)
        }
    
        getPosts()

    }, [apiUrl, sessionToken])
    

    if (loading) {
        return (
            <h1>Carregando...</h1>
        )
    }

    return (
        <>
        <NavBar sessionToken={sessionToken} apiUrl={apiUrl} />
        <div className="container-sm" >
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
                / >
            ))}
        </div>
        </>
    )
}

export default Feed
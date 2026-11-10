const express = require('express')
const crypto = require('node:crypto')
const sqlite = require('node:sqlite')
const cors = require('cors')


const auth = require('./auth.mjs')

const app = express()
app.use(express.json())
app.use(cors())
const db = new sqlite.DatabaseSync("database.db")

// Inicializando o banco de dados
db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            user TEXT UNIQUE NOT NULL,
            followers INTEGER,
            following INTEGER,
            name TEXT,
            profile_picture TEXT,
            bio TEXT,
            bio_link TEXT
        )
    `)

db.exec(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY,
            owner_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            image TEXT NOT NULL,
            description TEXT NOT NULL,
            likes INTEGER
        )       
    `)

db.exec(`
        CREATE TABLE IF NOT EXISTS auth (
            user TEXT NOT NULL,
            password TEXT NOT NULL
        )
    `)

const createUserSql = db.prepare('INSERT INTO users (user, followers, following) VALUES (?, 0, 0)')
const createCredSql = db.prepare('INSERT INTO auth (user, password) VALUES (?, ?)')
const createPostSql = db.prepare('INSERT INTO posts (owner_id, title, image, description, likes) VALUES (?, ?, ?, ?, 0)')

// const updateUserSql = db.prepare('UPDATE users SET ? = ? WHERE user = ?') // run(variavel, valor, user)

const getUserInfoSql = db.prepare('SELECT * FROM users WHERE user = ?')
const getUserInfoByIdSql = db.prepare('SELECT * FROM users WHERE id = ?')
const getAllPostsSql = db.prepare('SELECT * FROM posts')
const getPostByIdSql = db.prepare("SELECT * FROM posts WHERE id = ?")

const likePostSql = db.prepare("UPDATE posts SET likes = likes + 1 WHERE id = ?")

const getAllPostsFromUserSql = db.prepare('SELECT * FROM posts WHERE owner_id = ?')
const findCredSql = db.prepare('SELECT password FROM auth WHERE user = ?')




app.post('/api/users/new', (req, res) => {
    if (!req.body.user || !req.body.password) {
        res.status(400).send("Please provide 'user' and 'password' fields")
        return
    }
    if (getUserInfoSql.get(req.body.user) != undefined) {
        res.status(409).send("user already exists")
        return
    }
    createUserSql.run(req.body.user)
    const passwordHash = crypto.createHash('sha512')
    passwordHash.update(req.body.password)
    createCredSql.run(req.body.user, passwordHash.digest('hex'))
    res.status(200).end()
})

app.get('/api/users/login', (req, res) => {
    if (req.query.user == undefined || req.query.password == undefined) {
        res.status(400).send("must provide 'user' and 'password' fields")
        return
    }
    const cred = findCredSql.get(req.query.user)
    if (cred == undefined) {
        res.status(404).send("invalid credentials")
        return
    }
    const passwordHash = crypto.createHash('sha512')
    passwordHash.update(req.query.password)

    if (passwordHash.digest('hex') == cred.password) {
        res.json(auth.createToken(req.query.user))
    } else {
        res.status(404).send("invalid credentials")
    }
})

app.patch('/api/users', (req, res) => {
    const targetUser = auth.validateToken(req.body.token)
    if (targetUser == false) {
        res.status(401).send("invalid token")
        return
    }

    let newUserName = targetUser
    if (req.body.user != undefined && req.body.user != targetUser) {
        if (getUserInfoSql.get(req.body.user) != undefined) {
            res.status(409).send("user already exists")
            return
        }
        newUserName = req.body.user
    }

    if (req.body.name != undefined) db.prepare('UPDATE users SET name = ? WHERE user = ?').run(req.body.name, targetUser)
    if (req.body.bio != undefined) db.prepare('UPDATE users SET bio = ? WHERE user = ?').run(req.body.bio, targetUser)
    if(req.body.profile_picture != undefined) db.prepare('UPDATE users SET profile_picture = ? WHERE user = ?').run(req.body.profile_picture, targetUser)
    if (req.body.bio_link != undefined) db.prepare('UPDATE users SET bio_link = ? WHERE user = ?').run(req.body.bio_link, targetUser)

    if (newUserName != targetUser) {
        db.prepare('UPDATE users SET user = ? WHERE user = ?').run(newUserName, targetUser)
        db.prepare('UPDATE auth SET user = ? WHERE user = ?').run(newUserName, targetUser)
        auth.renameUser(targetUser, newUserName)
    }

    const updatedProfile = getUserInfoSql.get(newUserName)
    res.json(updatedProfile)
})

app.get('/api/users/:user', (req, res) => {
    let userInfo = getUserInfoSql.get(req.params.user)
    if (userInfo == undefined) {
        userInfo = getUserInfoByIdSql.get(req.params.user)
        if (userInfo != undefined) {
            res.json(userInfo)
        } else {
            res.status(404).end()
        }
    } else {
        res.json(userInfo)
    }
})

app.get('/api/user', (req, res) => {
    if (req.query.token == undefined) {
        res.status(401).end()
        return
    }
    const userName = auth.validateToken(req.query.token)
    if (userName === false) {
        res.status(404).end()
        return
    }
    const userInfo = getUserInfoSql.get(userName)
    if (userInfo == undefined) {
        res.status(404).end()
    } else {
        res.json(userInfo)
    }
})

app.post('/api/posts', (req, res) => {
    const userName = auth.validateToken(req.body.token)
    if (userName == false) {
        res.status(401).end()
        return
    }
    if (!req.body.title || !req.body.image || !req.body.description) {
        res.status(400).send("must provide 'title', 'image' and 'description' fields")
        return
    }
    const userInfo = getUserInfoSql.get(userName)
    if (userInfo == undefined) {
        res.status(404).end()
        return
    }
    const postTitle = req.body.title
    const postImage = req.body.image
    const postDescription = req.body.description

    createPostSql.run(userInfo.id, postTitle, postImage, postDescription)
    res.status(201).end()
})

app.get('/api/posts', (req, res) => {
    console.log("=== start GET /api/posts ===")
    const userName = auth.validateToken(req.query.token)
    if (userName != false) {
        res.json(getAllPostsSql.all())
    } else {
        res.status(401).end()
    }
})

app.post('/api/posts/:id/like', (req, res) => {
    const userName = auth.validateToken(req.body.token)
    if (userName == false) {
        res.status(401).end()
        return
    }
    likePostSql.run(req.params.id)
    res.status(200).end()
})


app.get('/api/about', (req, res ) => {
    res.send('instagram-backend v1.0.0')
})

app.listen(1234, () => {
    console.log("Listening on port 1234")
})

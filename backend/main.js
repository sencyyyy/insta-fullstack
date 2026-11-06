const express = require('express')
const crypto = require('node:crypto')
const sqlite = require('node:sqlite')

const auth = require('./auth.mjs')

const app = express()
app.use(express.json())
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
            bio TEXT
        )
    `)

db.exec(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY,
            owner_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            image TEXT NOT NULL
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

// const updateUserSql = db.prepare('UPDATE users SET ? = ? WHERE user = ?') // run(variavel, valor, user)

const getUserInfoSql = db.prepare('SELECT * FROM users WHERE user = ?')
const findCredSql = db.prepare('SELECT password FROM auth WHERE user = ?')




app.post('/api/users/new', (req, res) => {
    if (req.body.user == undefined || req.body.password == undefined) {
        res.status(400).send("Please provide 'user' and 'password' fields")
    } else {
        createUserSql.run(req.body.user)
        const passwordHash = crypto.createHash('sha512')
        passwordHash.update(req.body.password)
        createCredSql.run(req.body.user, passwordHash.digest('hex'))
        res.status(200).end()
    }
})

app.get('/api/users/login', (req, res) => {
    console.log(req.query)
    if (req.query.user == undefined || req.query.user == undefined) {
        res.status(400).send("must provide 'user' and 'password' fields")
    } else {
        const passwordHash = crypto.createHash('sha512')
        passwordHash.update(req.query.password)
        let actualPassword = findCredSql.get(req.query.user)["password"]
        console.log(actualPassword)

        if (passwordHash.digest('hex') == actualPassword) {
            res.json(auth.createToken(req.query.user))
        } else {
            res.status(404).send("invalid credentials")
        }
        

    }
})

app.patch('/api/users', (req, res) => {
    const targetUser = auth.validateToken(req.body.token)
    console.log(targetUser)
    if (targetUser == false) {
        res.status(401).send("invalid token")
    } else {
        if (req.body.name != undefined) db.prepare('UPDATE users SET name = ? WHERE user = ?').run(req.body.name, targetUser)
        if (req.body.bio != undefined) db.prepare('UPDATE users SET bio = ? WHERE user = ?').run(req.body.bio, targetUser)
        if(req.body.profile_picture != undefined) db.prepare('UPDATE users SET profile_picture = ? WHERE user = ?').run(req.body.profile_picture, targetUser)
        if (req.body.user != undefined) db.prepare('UPDATE users SET user = ? WHERE user = ?').run(req.body.user, targetUser)

        const updatedProfile = getUserInfoSql.get(req.body.user == undefined ? targetUser : req.body.user)
        res.json(updatedProfile)
    }
})

app.get('/api/users/:user', (req, res) => {
    const userInfo = getUserInfoSql.get(req.params.user)
    if (userInfo == undefined) {
        res.status(404).end()
    } else {
        res.json(userInfo)
    }
})

app.get('/api/user', (req, res) => {
    if (req.query.token == undefined) {
        res.status(401)
    } else {
        const userName = auth.validateToken(req.query.token)
        if (userName === false) {
            res.status(404).end()
        }
        const userInfo = getUserInfoSql.get(userName)
        if (userInfo == undefined) {
            res.status(404).end()
        } else {
            res.json(userInfo)
        }
    }
})


app.get('/api/about', (req, res ) => {
    res.send('instagram-backend v1.0.0')
})

app.listen(1234, () => {
    console.log("Listening on port 1234")
})

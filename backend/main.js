const express = require('express')
const crypto = require('node:crypto')
const sqlite = require('node:sqlite')

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
            bio TEXT
        )
    `)

db.exec(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY,
            owner_id INTEGER NOT NULL,
            title TEXT NOT NULL,
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

 const findCredSql = db.prepare('SELECT user FROM auth WHERE password = ?')


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
    if (req.body.user == undefined || req.body.user == undefined) {
        res.status(400).send("must provide 'user' and 'password' fields")
    } else {
        const passwordHash = crypto.createHash('sha512')
        passwordHash.update(req.body.password)
        try {
            const actualPassword = findCredSql.run()
        }
    }
})


app.get('/api/about', (req, res ) => {
    res.send('instagram-backend v1.0.0')
})

app.listen(1234, () => {
    console.log("Listening on port 1234")
})

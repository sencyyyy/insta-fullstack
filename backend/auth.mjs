import { randomBytes } from 'node:crypto'

export let tokenUserMap = {}

export function createToken(user) {
    let expireDate = Date.now()
    console.log(expireDate)
    expireDate = (expireDate + (1*60*60*1000)) // adicionando uma hora em milissegundo
    const token = randomBytes(16).toString('hex')
    tokenUserMap[token] = {
        user: user,
        expires: expireDate
    }
    console.log(tokenUserMap)
    return token
}

export function validateToken(token) {
    console.log(tokenUserMap)
    if (tokenUserMap[token] == undefined) return false

    const userToken = tokenUserMap[token]
    if(userToken.expires > Date.now()) {
        return userToken.user
    } else {
        return false
    }
}
const crypto = require('node:crypto')

export let tokenUserMap = {}

export function createToken(user) {
    const token = crypto.randombytes(16).toString('hex')
    tokenUserMap[token] = user
    return token
}
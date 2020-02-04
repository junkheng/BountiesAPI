let jwt = require('jsonwebtoken')
const config = require('./config')

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'] // express headers are auto converted to lower case
    if (token.startsWith('Bearer ')) {
        // remove Bearer from string
        token = token.slice(7, token.length)
    }
    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Invalid token'
                })
            } else {
                req.decoded = decoded
                next()
            }
        })
    } else {
        return res.json({
            success: false,
            message: 'auth token is not supplied'
        })
    }
}

module.exports = {
    checkToken: checkToken
}
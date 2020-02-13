let jwt = require('jsonwebtoken')
const config = require('./config')

module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization
        console.log(token)
        if (token.startsWith('Bearer ')) {
            // remove Bearer from string
            token = token.slice(7, token.length)
        }
        console.log(token)
        const decoded = jwt.verify(token, config.secret)
        req.userData = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
}
const jwt = require('jsonwebtoken')
const User = require('../model/user')
const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ '_id': decoded._id, 'tokens.token': token })
        if (!user) {
            throw Error()
        }

        req.user = user
        req.token = token
        next()
    } catch (e) {
        res.status(401).send({ error: 'please Authorization' })
    }

}

module.exports = auth
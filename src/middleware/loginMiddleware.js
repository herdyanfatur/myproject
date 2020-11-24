require('dotenv').config()
const jsonwebtoken = require('jsonwebtoken');

module.exports = async (req,res, next) => {
    const token = req.header('Authorization');

    if(!token) {
        return res.status(401).json({
            status:false,
            message: 'Anda Harus Login Terlebih Dahulu'
        })
    }
    
    const decode = jsonwebtoken.verify(token, process.env.SECRET)
    req.id = decode.id
    next()
}
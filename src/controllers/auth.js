// require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const user = require('../models/user');

exports.login = async (req, res) => {
    const { email, password} = req.body;

    const dataUser = await User.findOne({$or:[{email: email}, {username: email}]})
    if(dataUser) {
        //email found
        const passwordUser = await bcrypt.compare(password, dataUser.password)
        if(passwordUser){
        //password is correct
            const data = {
                id: dataUser._id,
                username: dataUser.username
            }
            console.log(data);
            const token = await jsonwebtoken.sign(data, process.env.SECRET);
            return res.status(200).json({
            message: `Hello ${data.username}`,
            token: token
            })
        } else{
            return res.status(404).json({
                status: false,
                message: 'Password salah!!'
            })
        }
    } else {
        return res.status(404).json({
            status: false,
            message: 'Email atau Password Salah!!'
        })
    }
    
}

exports.register = async (req, res) => {
    const { username, email, password} = req.body;

    const usernameUser = await User.findOne({username: username})
    if(usernameUser){
        return res.status(404).json({
            status: false,
            message: 'Username sudah terdaftar!',
        })
    }
    const emailUser = await User.findOne({email: email})
    if(emailUser){
        return res.status(404).json({
            status: false,
            message: 'email sudah terdaftar!',
        })
    }
    
    var salt = bcrypt.genSaltSync(10);
    var hashPassword = bcrypt.hashSync(password, salt);
    const user = new User ({
        username: username,
        email: email,
        password: hashPassword,
    })
    user.save()
    return res.status(201).json({
        status: true,
        message : 'User Berhasil terdaftar!',
    })
}

exports.getUser = async (req, res) => {
    const user= await User.findOne({_id: req.id})
    return res.status(200).json({
        message: 'berhasil di panggil',
        data: user
    })
}
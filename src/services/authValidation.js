const {check, validationResult } = require('express-validator');

exports.runValidation = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(404).json({
            status: false,
            message: errors.array()[0].msg
        })
    }
    next()
}

exports.validationList = [
    check('username','Username Tidak Boleh Kosong!').notEmpty().isLength({min : 5}).withMessage('username minimal 5 huruf!'),
    check('email','Email tidak boleh kosong').notEmpty().isEmail().withMessage('Format email salah !'),
    check('password','password tidak boleh kosong').notEmpty().isLength({ min: 5}).withMessage('Password Minimal 5 huruf'),
];

exports.validationLogin = [
    check('email','Email tidak boleh kosong').notEmpty(),
    check('password','password tidak boleh kosong').notEmpty(),
]

require('dotenv').config();
//console.log(require('dotenv').config().parsed)
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//file upload handler
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const passport = require('passport');


const app = express();
const cors = require('cors')

const authRoutes = require('./src/routes/auth');
const blogRoutes = require('./src/routes/blog');

// const fileStorage = multer.diskStorage({
//     cb is "callback"
//     destination: (req, file, cb) => {
//         'images' is a foler for saving file image
//         cb(null, 'images');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname, new Date().getTime() + '-' + file.originalname);
//    }
// })
const fileStorage = multer.diskStorage({
    // cb is "callback"
    destination: (req, file, cb) => {
        // 'images' is a foler for saving file images
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + new Date() + '-' + file.originalname);
    }
})
//module.exports = upload;

const fileFilter = (req, file, cb) => {
    console.log('String', file) 
    if( file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ){
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({storage: fileStorage, fileFilter: fileFilter})
app.use(bodyParser.json());
//middleware untuk mengakses folder images dan "__dirname adalah direktori project ini"
//express.static berfungsi untuk mendapatkan url static images
app.use('/images', express.static(path.join(__dirname, 'images')));
// middleware ".single('image')" untuk body yang dikirim pada penggunaan API
// app.use(multer({fileStorage: fileStorage}).single('image'));
app.use(upload.single('image'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/v1/auth', authRoutes);
app.use('/v1/blog', blogRoutes);

// middleware for error message
app.use((error, req, res, next) => {
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message : message, data: data});
});

// mongoURI = "mongodb+srv://herdyan:GswmWW263Vr93dK@cluster0.09gau.mongodb.net/Blog?retryWrites=true&w=majority"

mongoose.connect(process.env.mongoURI,  { useNewUrlParser: true, useUnifiedTopology:true  })

.then(() => {
    app.listen(4000, () => console.log('Connection success!'));
})
.catch(err => console.log(err));

 
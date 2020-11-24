const {validationResult} = require('express-validator');
const path = require('path');
const fs = require('fs');
const BlogPost = require('../models/blog');
const { count } = require('console');


exports.createBlogPost = (req, res) => {
    const errors = validationResult(req);

    // set error messages dinamis
    if(!errors.isEmpty()) {
        
        const err = new Error('invalid value');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;

        }
 
    if(!req.file) {
        const err = new Error('Image is required!');
        err.errorStatus = 422;
        throw err;
    }
    
    const title = req.body.title;
    const image = req.file.path;
    // console.log(image, 'bellum berhasil')
    const body  = req.body.body;
    
    const Posting = new BlogPost({
        title: title,
        body: body,
        image: image,
        author: {uid: 1, name: 'herdyan'}
    })
    
    Posting.save()
    .then(result => {
        const hasil = {
            message: 'Create Blog Post Success',
            data: result
        }
        res.status(201).json(hasil);
    })
    .catch(err => {
        console.log('err: ', err);
    });
}

// controller for get All Blog Posts
exports.getAllBlogPost = (req, res, next) => {
    //pagination (|| default value for page);
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    let totalItems;

    //pagination
    BlogPost.find()
    .countDocuments()
    .then(count => {
        totalItems = count;
        return BlogPost.find()
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage));
    })
    .then(result => {
        res.status(200).json({
            message: 'Data Blog Post berhasil dipanggil',
            data: result,
            total_items: totalItems,
            per_page:parseInt(perPage),
            current_page:parseInt(currentPage),
        })
    })
    .catch(err => {
        next(err);
    })

}

// controller for get blog post by id
exports.getBlogPostById = (req, res, next) => {
    const postId = req.params.postId;
    BlogPost.findById(postId)
    .then(result => {
        if(!result) {
            const error = new Error('Blog Post tidak ditemukan !');
            error.errorStatus = 404;
            throw error;
        }
        res.status(200).json({
            message : 'Data Berhasil dipanggil !',
            data: result,
        })
    })
    .catch(err => {
        next(err);
    })
}

exports.updateBlogPost = (req, res, next) => {
    const errors = validationResult(req);
    // set error messages dinamis
    if(!errors.isEmpty()) {
        
        const err = new Error('invalid value');
        err.errorStatus = 400;
        err.data = errors.array();
        throw error;

        }
 
    if(!req.file) {
        const err = new Error('Image is required!');
        err.errorStatus = 422;
        throw err;
    }

    const title = req.body.title;
    const image = req.file.path;
    // console.log(image, 'bellum berhasil')
    const body  = req.body.body;
    const postId = req.params.postId;

    BlogPost.findById(postId)
    .then(post => {
        if(!post) {
            const error = new Error('Blog Post Tidak ditemukan !');
            error.errorStatus = 404;
            throw error;
        }
        post.title = title;
        post.body = body;
        post.image = image;

        return post.save();
        })
    .then(result =>{
        res.status(200).json({
            message: 'Update Successed !',
            data: result,
        })
    })
    .catch(err => {
        next(err);
    })
}

exports.deleteBlogPost = (req, res, next) => {
    const postId = req.params.postId;
    
    BlogPost.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error('Blog Post not Found!');
            error.errorStatus = 400;
            throw error;
        }
        removeImage(post.image);
        return BlogPost.findByIdAndRemove(postId);
    })
    .then(result => {
        res.status(200).json({
            message: 'success deleted',
            data: result,
        })
    })
    .catch(err => {
        next(err);
    })
}

const removeImage = (filePath) => {
    console.log('filePath', filePath);
    console.log('dir name', __dirname);

    //masuk kedalam file path image
    filePath = path.join(__dirname, '../..', filePath);
    fs.unlink(filePath, err => console.log(err));

}
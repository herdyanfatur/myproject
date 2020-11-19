const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const fileStorage = require('../../index.js');
//const {fileStorage} = require('../../index.js')


const blogController = require('../controllers/blog');
const { route } = require('./auth.js');


// [POST] : /v1/blog/post
router.post('/post', [ 
  body('title').isLength({min:5}).withMessage('minimal panjang 5 huruf!'),
  body('body').isLength({min:5}).withMessage('minimal panjang 5 huruf!')
], blogController.createBlogPost);

router.get('/posts', blogController.getAllBlogPost);
router.get('/post/:postId', blogController.getBlogPostById);
router.put('/post/:postId',[ 
  body('title').isLength({min:5}).withMessage('minimal panjang 5 huruf!'),
  body('body').isLength({min:5}).withMessage('minimal panjang 5 huruf!')
], blogController.updateBlogPost);
router.delete('/post/:postId', blogController.deleteBlogPost);

module.exports = router;
const express = require('express');
const PostController = require('../controllers/PostController');

const isAuth = require('../middleware/isAuth');
const router = express.Router();

router.get('/', isAuth, PostController.getPosts);
router.post('/', PostController.createPost);
router.get('/:id', isAuth, PostController.getPost);
router.put('/:id', isAuth, PostController.updatePost);
router.delete('/:id', isAuth, PostController.deletePost);

module.exports = router;

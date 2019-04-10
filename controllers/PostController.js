const Post = require('../models/Post');
const User = require('../models/User');

exports.getPosts = async (req, res, next) => {
  const posts = await Post.find();
  if (!posts) {
    res.status(404).json({
      message: 'There are no posts to display',
      posts: posts,
    });
  }
  const post = await Post.find({ creator: req.user.id });
  res.send(post);
};

exports.createPost = async (req, res, next) => {
  // console.log(req.body);
  try {
    if (!req.file) {
      const error = new Error('No image provided.');
      error.statusCode = 422;
      throw error;
    }
    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;

    // I use her mongodb

    // const post = new Post({
    //   title: title,
    //   content: content,
    //   imageUrl: imageUrl,
    //   creator: req.user.id,
    // });

    // const result = await post.save();
    // const user = await User.findById(req.user.id);

    // const creator = await user.posts.push(post);
    // await user.save();

    // if (result) {
    //   res.status(201).json({
    //     message: 'Post created successfully',
    //     post: post,
    //     creator: {
    //       _id: creator._id,
    //       name: creator.name,
    //     },
    //   });
    // }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

exports.getPost = async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
  }
  res.send(post);
};

exports.updatePost = async (req, res) => {
  const postId = req.params.id;
  try {
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.body.imageUrl;
    const creator = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Could not find this post');
      error.statusCode = 404;
      throw error;
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    post.creator = creator;

    await post.save();
    res.status(200).json({
      message: 'Post updated successfully',
      post: post,
    });
  } catch (ex) {
    console.log(ex);
  }
};

exports.deletePost = async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findByIdAndRemove(postId);
  if (!post) {
    const error = new Error('Could not find post');
    errors.status = 404;
    throw error;
  }
  res.status(200).json({
    message: 'Deleted successfully',
  });
};

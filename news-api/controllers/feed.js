const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');
const io = require('../socket');
const Post = require('../models/post');
const User = require('../models/user');
// const Post = mongoose.model('Post');
// const User = mongoose.model('User');

exports.getPosts = async(req, res, next) => {
    const { page: currentPage } = req.query || 1;
    const perPage = 2;

    try {
        const totalItems = await Post.find().countDocuments()
        const posts = await Post.find().populate('creator').sort({ createAt: -1 }).skip((currentPage - 1) * perPage).limit(perPage);

        res.status(200).json({
            message: 'Post fetched',
            posts,
            totalItems
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
        return err;
    }
};

exports.getPost = (req, res, next) => {
    const { postId } = req.params;

    console.log('here');

    return Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('No post found.');

                error.statusCode = 404;

                throw error;
            }

            console.log('here 2');

            return res
                .status(200)
                .json({
                    message: 'Post fetched',
                    post
                });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            console.log('here error', err);

            next(err);
        })
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed, entered data is incorrect');

        error.statusCode = 422;

        throw error;
    }
    if (!req.file) {
        const error = new Error('No Image provided.');

        error.statusCode = 422;

        throw error;
    }

    // const imageUrl = req.file.path.replace("\\" ,"/");
    // imageUrl = req.file.path.replace("\\","/");
    const imageUrl = req.file.path;
    const { title, content } = req.body;
    let creator;
    const post = new Post({
        title,
        content,
        imageUrl,
        creator: req.userId,
    });

    return post.save()
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            creator = user;
            user.posts.push(post);
            return user.save();
        })
        .then(result => {

            res.status(201).json({
                message: 'Post created successfully',
                post,
                creator: { _id: creator._id, name: creator.name }
            });

            return result;
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
            return err;
        })
};

exports.updatePost = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed, entered data is incorrect');

        error.statusCode = 422;

        throw error;
    }
    const { postId } = req.params;
    const { title, content } = req.body;
    let imageUrl = req.body.image;

    if (req.file) {
        imageUrl = req.file.path;
    }

    if (!imageUrl) {
        const error = new Error('No Image provided.');

        error.statusCode = 422;

        throw error;
    }

    Post.findById(postId).populate('creator')
        .then((post) => {
            if (!post) {
                const error = new Error('No post found.');

                error.statusCode = 404;

                throw error;
            }

            if (post.creator._id.toString() !== req.userId) {
                const error = new Error('Not Authorized.');

                error.statusCode = 403;

                throw error;
            }

            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }

            post.title = title;
            post.content = content;
            post.imageUrl = imageUrl;

            return post.save();
        })
        .then((result) => {
            io.getIO().emit('posts', { action: 'update', post: result });
            res
                .status(200)
                .json({
                    message: 'Post Updated',
                    post: result
                });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        })
};

exports.updateUserStatus = (req, res, next) => {
    const { status } = req.body;

    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error('No user found.');

                error.statusCode = 404;

                throw error;
            }

            user.status = status;

            return user.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'updated status successfully',
                status,
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        })
};

exports.getUserStatus = async(req, res, next) => {

    try {
        const user = await User.findById(req.userId);

        if (!user) {
            const error = new Error('No user found.');
    
            error.statusCode = 404;
    
            throw error;
        }

        res.status(200).json({
            status: user.status,
        })    
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    }
};

exports.deletePost = (req, res, next) => {
    const { postId } = req.params;

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('No post found.');

                error.statusCode = 404;

                throw error;
            }
            if (post.creator.toString() !== req.userId) {
                const error = new Error('Not Authorized.');

                error.statusCode = 403;

                throw error;
            }
            clearImage(post.imageUrl);

            return Post.findByIdAndRemove(postId);
        })
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            user.posts.pull(postId);

            return user.save();
        })
        .then(() => {
            io.getIO().emit('posts', { action: 'delete', post: postId });
            res
                .status(200)
                .json({
                    message: 'Post Deleted'
                });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        })
}


const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};
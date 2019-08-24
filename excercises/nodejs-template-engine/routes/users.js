const express = require('express');

const router = express.Router();

const users = [];

router.get('/users', (req, res, next) => {
    res.render('users', {users});
});

router.post('/add-user', (req, res, next) => {
    console.log('req.body.username', req.body.username);
    users.push({username: req.body.username});
    res.redirect('/users');
});

exports.routes = router;
exports.users = users;

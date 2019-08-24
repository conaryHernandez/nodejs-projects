const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('im here');

    res.render('login', {});
});

module.exports = router;
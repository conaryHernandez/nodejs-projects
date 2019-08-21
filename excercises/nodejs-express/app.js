const express = require('express');

const app = express();

app.use('/users', (req, res, next) => {
    console.log('hello from users');
    next();
});

app.use('/', (req, res, next) => {
    console.log('nice to see you!');
    res.send('<h1>Nani????</h1>');
});


app.listen(3001);
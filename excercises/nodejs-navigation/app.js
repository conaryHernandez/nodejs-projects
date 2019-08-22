const path = require('path');

const express = require('express');

const app = express();

const homeRoutes = require('./routes/home');
const userRoutes = require('./routes/users');

app.use(express.static(path.join(__dirname, 'public')));

app.use(userRoutes);
app.use(homeRoutes);

app.listen(3001);
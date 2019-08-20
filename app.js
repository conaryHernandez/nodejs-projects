const http = require('http');

const express = require('express');

const app = express();

app.use((req, res, next) => {
	console.log('im a middleware');
	next(); // allow the request to continue in the next middleware
});

app.use((req, res, next) => {
	console.log('im a middleware 2');
	res.send('<h1>Hello from express</h1>')
});

const server = http.createServer(app);

server.listen(3000);

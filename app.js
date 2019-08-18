const http = require('http');
const fs = require('fs');

/* Creating Server - 1 Example 
function rqListener (req, res) {
	// body... 
}

http.createServer(rqListener);
*/

// request listener, it will excute in each request
const server = http.createServer((req, res) => {
	const url = req.url;
	const method = req.method;

	if (url === '/') {
		res.write('<html>');
		res.write('<head><title>Enter a Message</title></head>');
		res.write('<body><form action="/message" method="POST"><input name="message" type="text"></input><button type="submit">Send</button></form></body>')
		res.write('</html>');
		return res.end();	
	}

	if (url === '/message'  && method === 'POST') {
		const body = [];

		req.on('data', (chunk) => {
			console.log('chunk', chunk);
			body.push(chunk);
		});
		req.on('end', () => {
			const parsedBody = Buffer.concat(body).toString(); // used strignbecause we know that we are receiving a string.

			console.log('pasedBody', parsedBody);

			const message = parsedBody.split('=')[1];
			fs.writeFileSync('message.txt', message);
		});
		res.statusCode = 302;
		res.setHeader('Location', '/');
		return res.end();
		// res.writeHead(302, {});
	}

	res.setHeader('Content-Type', 'text/html');
	res.write('<html>');
	res.write('<head><title>My First page</title></head>');
	res.write('<body><h1>Hello from my server</h1></body>')
	res.write('</html>');
	res.end();
	// process.exit(); // forces a exit
});

server.listen(3000);


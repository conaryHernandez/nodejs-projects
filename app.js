const http = require('http');

/* Creating Server - 1 Example 
function rqListener (req, res) {
	// body... 
}

http.createServer(rqListener);
*/

// request listener, it will excute in each request
const server = http.createServer((req, res) => {
	console.log('server up', req);
});

server.listen(3000);


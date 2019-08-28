const http = require('http');

const routes = require('./routes');

// request listener, it will excute in each request
const server = http.createServer(routes);

server.listen(3000);

/* Creating Server - 1 Example 
function rqListener (req, res) {
	// body... 
}

http.createServer(rqListener);
*/

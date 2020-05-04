const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Welcome</title></head>');
        res.write('<body><h1>Welcome to my site</h1></body>');
        res.write('</html>');
        return res.end();
    }

    if (url === '/users') {
        res.write('<html>');
        res.write('<head><title>Users</title></head>');
        res.write('<body>');
        res.write('<h1>Our users</h1><ul>List:<li>User 1</li><li>User 2</li></ul>');
        res.write('<form method="POST" action="create-user"><input name="user" type="text"></input><button type="submit">Add</button></form>')
        res.write('</body>');
        res.write('</html>');
        return res.end();        
    }

    if (url === '/create-user') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
            console.log(chunk);
        });
        
        req.on('end', () => {
            console.log('body', body);

            const parsedBody = Buffer.concat(body).toString();
            console.log('parsedBody', parsedBody);
 
            const message = parsedBody.split('=')[1];

            console.log('message', message);

            fs.writeFile('new-user.txt', message, (err) => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }
};

module.exports = requestHandler;
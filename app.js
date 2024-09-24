const http = require('http');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'messages.txt');

// Function to read messages from the file
const readMessages = () => {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
  }
  return [];
};

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    const messages = readMessages(); // Read messages from the file
    res.write('<html>');
    res.write('<head><title>Enter Message</title></head>');
    res.write('<body>');
    // Display existing messages
    res.write('<h2>Messages:</h2><ul>');
    messages.forEach((message) => {
      res.write(`<li>${message}</li>`); // Show each message
    });
    res.write('</ul>');
    res.write('<form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form>');
    res.write('</body>');
    res.write('</html>');
    return res.end();
  }

  // Handling POST request for new messages
  if (url === '/message' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString(); // Convert Buffer to string
    });

    req.on('end', () => {
      const message = new URLSearchParams(body).get('message');
      if (message) {
        fs.appendFileSync(filePath, message + '\n'); // Append new message to the file
      }
      res.statusCode = 302; // Redirect to the homepage
      res.setHeader('Location', '/');
      return res.end();
    });
  }

  // Fallback for other routes
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title></head>');
  res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
  res.write('</html>');
  res.end();
});

server.listen(3000);

require('dotenv').config()
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();
const port = process.env.PORT || 3000;


// Its strongly suggested to put the API key *not* here, but
// instead create a new file named ".env" with the following
// content:
// OPENAI_API_KEY=...
// That file should never be committed to GitHub or made public
// in some other way.

const api_key = process.env.OPENAI_API_KEY || '';
if (!api_key) {
  console.error('OPENAI_API_KEY is not set');
}


app.use('/', proxy('api.openai.com', {
  filter: (req, res) => {
    return req.path != '/';
  },
  https: true,
  proxyReqBodyDecorator: function(bodyContent, srcReq) {
    try {
      let logText = 'Request from ' + srcReq.ip;
      if (srcReq.headers['x-forwarded-for']) {
        logText += ', x-forwarded-for ' + srcReq.headers['x-forwarded-for'];
      }
      logText += ' at ' + (new Date).toString() + ': ' + bodyContent.toString();
      console.log(logText);
      //fs.appendFileSync('log.txt', logText + '\n');
    } catch (e) {
    }
    return bodyContent;
  },
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers['Authorization'] = 'Bearer ' + api_key;
    return proxyReqOpts;
  }
}));

app.use(cors({
  origin: '*'
}));

app.all('/', (req, res) => {
  res.send('Running');
});


try {
  let privateKey = fs.readFileSync('certs/privkey.pem', 'utf8');
  let certificate = fs.readFileSync('certs/fullchain.pem', 'utf8');
  let server = https.createServer({ key: privateKey, cert: certificate }, app);
  server.listen(port);
  console.log('Server listening on port ' + port + ' for HTTPS');
} catch (e) {
  console.warn('No TLS certificates available');
  let server = http.createServer(app);
  server.listen(port);
  console.log('Server listening on port ' + port + ' for HTTP');
}

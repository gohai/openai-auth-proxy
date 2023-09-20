require('dotenv').config()
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

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const proxy = require('express-http-proxy');
const config = require('./config/config');
const logger = require('./config/logger');
const morgan = require('./config/morgan');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

let hasBody;
app.use((req, res, next) => {
  if (req.headers['content-type'] === 'application/json') {
    hasBody = true
  } else {
    hasBody = false
  }
  next();
});
app.use('/screen-a', proxy('http://localhost:3001', {
  parseReqBody: false,
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {

    if(srcReq.headers['content-type'] && srcReq.headers['content-type'].includes('multipart/form-data')) {
      proxyReqOpts.headers['Content-Type'] = srcReq.headers['content-type']
    } else {
      proxyReqOpts.headers['Content-Type'] = 'application/json'
      proxyReqOpts.headers.body = JSON.stringify(srcReq.body)
    }
    return proxyReqOpts;
  }}
));
app.use('/screen-b', proxy('http://localhost:3002'));


// api not found
const notFound = { 
  "success": false,
  "data": {},
  "message": "Api Not Found on Gateway",
  "error": {
    "status": true,
    "code": 8000,
    "message": "ApiNotFound"
  }
}

app.use((req, res, next) => {
  res.status(404).send(notFound);
});

app.listen(config.port, () => {
  logger.info(`Listening to Port ${config.port}`);
});


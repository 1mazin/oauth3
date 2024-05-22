const app = require('./index');
const serverless = require('serverless-http');

module.exports = app;
module.exports.handler = serverless(app);

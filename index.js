const { join } = require('path');

require('dotenv').config({
	path: join(__dirname, 'env', 'common.env')
});

console.log(process.env.SLACK_CLIENT_ID);
require('./dist');

const { join } = require('path');

require('dotenv').config({
	path: join(__dirname, 'env', '__private__.env')
});

require('./dist');

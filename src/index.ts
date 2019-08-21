import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as handlers from './handlers';
import config from './config/server';

const { host, port } = config;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((_, res, next) => {
	res.setHeader('X-Powered-By', 'Alexis Bize');
	return next();
});

app.post('/search', handlers.search.handleSearch);
app.get('/oauth-callback', handlers.oauth.handleCallback);
app.get('*', (_, res) => res.redirect(301, 'https://www.deezer.com/'));

app.listen(port, host, err => {
	if (err) throw err;
	else console.info(`> Listening at http://${host}:${port}`);
});

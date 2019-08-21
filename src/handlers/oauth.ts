import * as request from 'request';
import config from '../config/slack';
import { Request, Response } from 'express';
import { stringify } from 'querystring';

export const handleCallback = (req: Request, res: Response) => {
	const { code = '' } = req.query;

	if (code.length === 0 || typeof code !== 'string') {
		return res.sendStatus(400);
	}

	request(
		{
			uri: 'https://slack.com/api/oauth.access',
			method: 'POST',
			gzip: true,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: stringify({
				client_id: config.clientId,
				client_secret: config.clientSecret,
				code
			})
		},
		(err: any, response: request.Response, body: any) => {
			if (err) return res.sendStatus(500);
			else if (response.statusCode !== 200)
				return res.sendStatus(response.statusCode);
			return res.send(JSON.parse(body));
		}
	);
};

import * as request from 'request';
import { Request, Response } from 'express';
import { createErrorPayload } from '../modules/utils';

type SearchResult = {
	id: string;
	title: string;
	artist: {
		id: string;
		name: string;
		link: string;
		picture_small: string;
		[key: string]: any;
	};
	album: {
		cover_medium: string;
		[key: string]: any;
	};
	[key: string]: any;
};

const createAttachement = (response: SearchResult) => ({
	color: '#007feb',
	author_icon: response.artist.picture_small,
	author_link: `https://www.deezer.com/artist/${response.artist.id}`,
	author_name: response.artist.name,
	title: response.title,
	title_link: `https://www.deezer.com/track/${response.id}`,
	image_url: response.album.cover_medium,
	actions: [
		{
			type: 'button',
			text: '▶️ Listen on Deezer',
			url: `https://www.deezer.com/track/${response.id}`,
			style: 'primary'
		},
		{
			type: 'button',
			text: 'Download the app',
			url: `https://www.deezer.com/download`,
			style: 'secondary'
		}
	]
});

export const handleSearch = (req: Request, res: Response) => {
	const { text = '', channel_id = null, user_name = 'N/A' } = req.body;

	if (String(text).length === 0) {
		return res.send(
			createErrorPayload("Oops! You didn't provide any text!")
		);
	} else if (channel_id === null) return res.sendStatus(400);

	const query = text.length >= 50 ? text.substring(0, 50) : text;

	request(
		{
			method: 'GET',
			json: true,
			uri: `https://api.deezer.com/search/track?q=${encodeURIComponent(
				query
			)}`
		},
		(err, response, body) => {
			if (err) throw err;
			else if (response.statusCode !== 200)
				throw new Error('Invalid HTTP response');
			else if (body.data[0] === void 0)
				return res.send(
					createErrorPayload(`No results for "${query}"`)
				);
			else
				return res.send({
					response_type: 'in_channel',
					channel: channel_id,
					attachments: [
						{
							...createAttachement(body.data[0]),
							footer: `Shared by @${user_name}`
						}
					]
				});
		}
	);
};

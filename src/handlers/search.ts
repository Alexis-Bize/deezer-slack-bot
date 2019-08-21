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

const onSearchResult = (response: SearchResult, channelId: string) => ({
	response_type: 'in_channel',
	channel: channelId,
	attachments: [
		{
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
				}
			]
		}
	]
});

export const handleSearch = (req: Request, res: Response) => {
	const { text = '', channel_id = null } = req.body;

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
			return res.send(
				body.data[0] !== void 0
					? onSearchResult(body.data[0], channel_id)
					: createErrorPayload(`No results for "${query}"`)
			);
		}
	);
};

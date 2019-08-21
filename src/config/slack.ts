export default {
	clientId: String(process.env.SLACK_CLIENT_ID || ''),
	clientSecret: String(process.env.SLACK_CLIENT_SECRET || '')
};

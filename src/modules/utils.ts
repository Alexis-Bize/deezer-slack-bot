export const createErrorPayload = (message = 'Something went wrong...') => ({
	response_type: 'ephemeral',
	text: `*Error:* ${message}`
});

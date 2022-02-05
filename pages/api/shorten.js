const axios = require("axios");

/*
exports.handler = async (event, context) => {
	console.log("context", context);

	// @TODO: only proceed if valid firebase accessToken

	const { url } = JSON.parse(event.body),
		urlObj = new URL(url),
		allowed_urls = [
			"tcf.org.pk",
			"tcfusa.org",
			"tcfcanada.org",
			"tcf-uk.org",
			"tcfaustralia.org",
			"tcfnorway.org",
			"tcfitalia.org",
		],
		config = {
			token: process.env.BITLY_TOKEN,
			group_guid: "",
		},
		options = {
			method: "POST",
			headers: {
				Authorization: `Bearer ${config.token}`,
				"Content-Type": "application/json",
			},
			url: "https://api-ssl.bitly.com/v4/shorten",
			data: JSON.stringify({
				long_url: urlObj.toString(),
				domain: "bit.ly",
				tags: ["bulk-utm-builder", "api"],
				group_guid: config.group_guid,
			}),
		},
		token = context.clientContext?.identity?.token;

	if (allowed_urls.includes(urlObj.hostname) === false) {
		return {
			statusCode: 401,
			body: JSON.stringify('Disallowed domain')
		  }
	}

	if (token) {
		return await axios(options)
			.then((response) => {
				return {
					statusCode: 200,
					body: JSON.stringify(response.data.link),
					headers: {
						"Content-Type": "application/json",
					},
				};
			})
			.catch((error) => {
				// console.log(error);
				return {
					statusCode: error.response.status,
					body: `Error ${error.response.status}: ${error.response.statusText}`,
					headers: {
						"Content-Type": "application/json",
					},
				};
			});
	}
	else {
		return {
			statusCode: 401,
			body: JSON.stringify('Unauthorised')
		  }
	}
};
*/

export default function handler(req, res) {

	const { url } = req.body,
		urlObj = new URL(url),
		allowed_urls = [
			"tcf.org.pk",
			"tcfusa.org",
			"tcfcanada.org",
			"tcf-uk.org",
			"tcfaustralia.org",
			"tcfnorway.org",
			"tcfitalia.org",
		],
		config = {
			token: process.env.BITLY_TOKEN,
			group_guid: "",
		},
		options = {
			method: "POST",
			headers: {
				Authorization: `Bearer ${config.token}`,
				"Content-Type": "application/json",
			},
			url: "https://api-ssl.bitly.com/v4/shorten",
			data: JSON.stringify({
				long_url: urlObj.toString(),
				domain: "bit.ly",
				tags: ["bulk-utm-builder", "api"],
				group_guid: config.group_guid,
			}),
		};
		// user = await firebaseAdmin.auth().verifySessionCookie(req.cookies.session);

	// token = context.clientContext?.identity?.token;

	console.log(req.cookies.session);

	res.status(200).json({
		statusCode: 200,
		data: {
			link: 'shortened link'
		},
		headers: {
			"Content-Type": "application/json",
		},
	});
}

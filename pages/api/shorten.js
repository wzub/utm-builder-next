const axios = require("axios");
import { verifyIdToken } from "../../lib/firebase-admin";
import { saveLink } from "../../lib/db";

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

export default async function handler(req, res) {
	try {
		const validatedToken = await verifyIdToken(req.cookies.token),
			{ url } = req.body,
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

		if (allowed_urls.includes(urlObj.hostname) === false) {
			res.status(401).send("Disallowed domain");
			// throw new Error("Disallowed domain");
		}

		// create bitly using country specific domains
		if (urlObj.hostname === "tcf.org.pk") {
			options.data.domain = "link.tcf.org.pk"
		}

		if (validatedToken.sub) {
			await axios(options)
				.then((response) => {
					// save to db
					saveLink(validatedToken.sub, {
						domain: urlObj.host,
						link: urlObj.toString(),
						shortlink: response.data.link,
					});

					res.status(200).json({
						shortlink: response.data.link,
					});
				})
				.catch((error) => {
					console.log(error);
					throw new Error("Couldn't create a short link");
				});
		} else {
			res.status(403).send("Couldn't validate session");
			// throw new Error("Couldn't validate session");
		}
	} catch (error) {
		console.error(error);
		res.status(error.status || 500).json(error.message);
	}
}

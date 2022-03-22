const axios = require("axios");
import { verifyIdToken } from "../../lib/firebase-admin";
import { saveLink } from "../../lib/db";

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
			shortlinkDomain = () => {
				// create bitly using country specific domains
				if (urlObj.hostname === "tcf.org.pk") {
					return "link.tcf.org.pk";
				}
				else return "bit.ly";
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
					domain: shortlinkDomain(),
					tags: ["bulk-utm-builder", "api"],
					group_guid: config.group_guid,
				}),
			};

		if (allowed_urls.includes(urlObj.hostname) === false) {
			res.status(401).send("Disallowed domain");
			// throw new Error("Disallowed domain");
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

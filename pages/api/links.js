import { verifyIdToken } from "../../lib/firebase-admin";
import { getUserLinks } from "../../lib/db";

export default async function handler(req, res) {
	try {
		const validatedToken = await verifyIdToken(req.cookies.token);

		if (validatedToken.sub) {
			const userLinks = await getUserLinks(validatedToken.sub);

			if (userLinks) {
				res.status(200).json({ userLinks });
			} else {
				res.status(500).json("Couldn't fetch links");
			}
		}
		else {
			res.status(403).json("Authorization error");
		}
	} catch (error) {
		console.error("link fetch error", error);
		res.status(error.status || 500).json(error.message);
	}
}

import { verifyIdToken } from "../../lib/firebase-admin";
import { getSites } from "../../lib/db";

export default async function handler(req, res) {
	try {
		const validatedToken = await verifyIdToken(req.cookies.token);
		
		if (validatedToken.sub) {
			const sites = await getSites(validatedToken.sub);

			if (sites) {
				res.status(200).json({ sites });
			} else {
				res.status(500).json("Couldn't fetch sites");
			}
		}
		else {
			res.status(403).json("Authorization error");
		}

	} catch (error) {
		console.error("firebase admin error", error);
		res.status(error.status || 500).json(error.message);
	}
}

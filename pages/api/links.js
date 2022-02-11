import { collection, orderBy, query, where, getDocs } from "firebase/firestore";
import { verifyIdToken } from "../../config/firebase-admin-config";
import { db } from "../../config/firebase-client-config";

export default async function handler(req, res) {
	try {
		const validatedToken = await verifyIdToken(req.cookies.token);

		const q = query(
			collection(db, "links"),
			where("user", "==", validatedToken.sub),
			orderBy("created", "desc")
		);

		const querySnap = await getDocs(q);
		let links = [];

		if (querySnap) {
			querySnap.forEach((doc) => {
				links.push({ id: doc.id, ...doc.data() });
			});

			res.status(200).json({links})
		}
		else {
			// doc.data() will be undefined in this case
			console.log("Couldn't find links from this user");
		}
	} catch (error) {
		console.error("firebase admin error", error);
		res.status(error.status || 500).json(error.message);
	}
}

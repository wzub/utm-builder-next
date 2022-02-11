const admin = require("firebase-admin");
const serviceAccount = require("./firebase-secrets.json");

export const verifyIdToken = async (token) => {
	if (!admin.apps.length) {
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
		});
	}

	return admin
		.auth()
		.verifyIdToken(token)
		.catch((error) => {
			throw error;
		});
};

const admin = require("firebase-admin");

export const verifyIdToken = async (token) => {
	if (!admin.apps.length) {
		admin.initializeApp({
			credential: admin.credential.cert({
				client_email: process.env.FIREBASE_CLIENT_EMAIL,
				privateKey: process.env.FIREBASE_PRIVATE_KEY
					? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n")
					: undefined,
				project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
			}),
		});
	}

	return admin
		.auth()
		.verifyIdToken(token)
		.catch((error) => {
			throw error;
		});
};

import { createContext, useContext, useState, useEffect } from "react";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	updateProfile,
	updatePassword,
	onIdTokenChanged,
} from "firebase/auth";
import { auth, db } from "../config/firebase-client-config";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import nookies from "nookies";
import Spinner from "../components/Spinner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [loggedIn, setLoggedIn] = useState(false);
	const [error, setError] = useState(true);
	const [checkingStatus, setCheckingStatus] = useState(true);

	const saveUser = async (userData) => {
		return await setDoc(doc(db, "users", userData.uid), {
			created: serverTimestamp(),
			// partner: 'Pakistan',
			name: userData.displayName,
			email: userData.email
		});
	};

	const signup = async (name, email, password) => {
		const newUser = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);

		await updateProfile(auth.currentUser, {
			displayName: name,
		});

		// create a record in firestore
		saveUser(auth.currentUser);

		setCurrentUser(auth.currentUser);
		setLoggedIn(true);
		return newUser;
	};

	const login = async (email, password) => {
		const loggedInUser = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);

		setCurrentUser(loggedInUser.user.auth.currentUser);
		setLoggedIn(true);
		return loggedInUser.user.auth.currentUser;
	};

	const logout = async () => {
		setCurrentUser(null);
		setLoggedIn(false);
		return await signOut(auth);
	};

	const updateprofile = async (name) => {
		return await updateProfile(auth.currentUser, {
			displayName: name,
		});
	};

	const updatepassword = async (newPassword) => {
		return await updatePassword(auth.currentUser, newPassword);
	};

	useEffect(() => {
		const unsubscribe = onIdTokenChanged(auth, async (user) => {
			if (user) {
				const token = await user.getIdToken(true);
				nookies.set(undefined, "token", token, {
					path: "/",
					secure: process.env.NODE_ENV !== "development",
					sameSite: "strict",
				});
				setCurrentUser(user);
				setLoggedIn(true);
			} else {
				nookies.set(undefined, "token", "", {
					path: "/",
					expires: new Date(0),
				});
				setCurrentUser(null);
				setLoggedIn(false);
			}
			setCheckingStatus(false);
		});

		return () => unsubscribe();
	}, []);

	if (checkingStatus) {
		return <Spinner />;
	}

	return (
		<AuthContext.Provider
			value={{
				currentUser,
				signup,
				login,
				logout,
				updateprofile,
				updatepassword,
				loggedIn,
				checkingStatus,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};

export default AuthContext;

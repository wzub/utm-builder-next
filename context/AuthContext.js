import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	updateProfile,
	updatePassword,
} from "firebase/auth";
import { auth } from "../config/firebase-client-config";
import nookies from "nookies";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [loggedIn, setLoggedIn] = useState(false);
	const [error, setError] = useState(true);
	const [checkingStatus, setCheckingStatus] = useState(true);

	const signup = async (name, email, password) => {
		const newUser = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);

		updateProfile(auth.currentUser, {
			displayName: name,
		});

		setCurrentUser(auth.currentUser);
		return newUser;
	};

	const login = async (email, password) => {
		return await signInWithEmailAndPassword(auth, email, password);
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
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				const token = await currentUser.getIdToken();
				console.log("token", token);

				nookies.set(undefined, "token", token, {});
				console.log("cookie set");

				setCurrentUser(currentUser);
				setLoggedIn(true);
			}
			setCheckingStatus(false);
		});
		return () => {
			unsubscribe();
		};
	}, []);
	
	if (checkingStatus) {
		return (
			<div className="container my-5 text-center">
				<div className="spinner-grow" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		)
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

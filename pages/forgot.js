import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

function ForgotPassword() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const { currentUser, updateprofile, updatepassword } = useAuth();
	const [formData, setFormData] = useState({ email: "" });

	const { email } = formData;

	const handleChange = (e) => {
		const id = e.target.id;
		const value = e.target.value;
		setFormData((values) => ({ ...values, [id]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setError("");
			setLoading(true);

			await sendPasswordResetEmail(auth, email);

			setError({
				type: "info",
				message:
					"Great, check your email for a link to reset your password.",
			});
		} catch (error) {
			setLoading(false);
			setError({
				type: "danger",
				message: "Sorry, couldn't find any user with that email address.",
			});
		}

		setLoading(false);
	};

	return (
		<Layout title="Reset Password">
			{error && (
				<div className={`alert alert-${error.type}`}>
					{error.message}
				</div>
			)}
			<div className="row d-flex justify-content-center align-items-center w-100 py-3">
				<div className="col-md-6">
					<h2 className="text-center mb-3">Forgot Password</h2>
					<p className="text-center">
						Enter your email address below to receive a link to
						reset your password.
					</p>
					<form onSubmit={handleSubmit}>
						<div>
							<label htmlFor="email" className="form-label">
								Email
							</label>
							<input
								id="email"
								className="form-control form-control-lg"
								type="email"
								value={email}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="align-items-center">
							<button
								disabled={loading}
								type="submit"
								className="btn btn-lg btn-primary my-3 w-100"
							>
								{loading ? "Sending..." : "Send reset email"}
							</button>
						</div>
					</form>
				</div>
			</div>
			<div className="w-100 text-center mt-2">
				<Link href="/signin">
					<a>Know your login details? Log In</a>
				</Link>
			</div>
		</Layout>
	);
}

export default ForgotPassword;

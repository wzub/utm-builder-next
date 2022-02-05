import { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

function SignInPage() {
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const { email, password } = formData;

	const router = useRouter();
	const { login } = useAuth();

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

			const userCredential = await login(email, password);
			if (userCredential.user) router.push("/");
		} catch (error) {
			setError({
				type: "danger",
				message:
					"Incorrect username or password. Please try again or reset your password.",
			});
			setLoading(false);
		}
	};

	return (
		<Layout title="Sign In">
			{error && (
				<div className={`alert alert-${error.type}`}>
					{error.message}
				</div>
			)}
			<div className="row d-flex justify-content-center align-items-center w-100 py-3">
				<div className="col-md-6">
					<h2 className="text-center mb-3">Welcome Back!</h2>
					<p className="text-center">
						Enter your email address and password to continue
					</p>
					<form onSubmit={handleSubmit}>
						<div className="mb-3">
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
						<div className="mb-3">
							<label htmlFor="password" className="form-label">
								Password
							</label>
							<input
								id="password"
								className="form-control form-control-lg"
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={handleChange}
							/>
							<div className="form-check">
								<input
									type="checkbox"
									className="form-check-input"
									id="togglePassword"
									label="Show password"
									onClick={() =>
										setShowPassword(
											(prevState) => !prevState
										)
									}
								/>
								<label
									htmlFor="togglePassword"
									className="form-check-label"
								>
									Show password
								</label>
							</div>
						</div>
						<div className="align-items-center">
							<button
								disabled={loading}
								type="submit"
								className="btn btn-primary btn-lg my-3 w-100"
							>
								{loading ? "Logging in..." : "Log in"}
							</button>
						</div>
					</form>
				</div>
			</div>
			<div className="w-100 text-center mt-2">
				<Link href="/forgot">
					<a>Forgot password?</a>
				</Link>
			</div>
			<div className="w-100 text-center mt-2">
				<Link href="/signup">
					<a>Don't have an account? Sign up</a>
				</Link>
			</div>
		</Layout>
	);
}

export default SignInPage;

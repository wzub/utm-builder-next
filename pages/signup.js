import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout } from "../components/Layout";
import { useAuth } from "../context/AuthContext";

function SignUpPage() {
	const router = useRouter();
	const { signup } = useAuth();

	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});

	const { name, email, password } = formData;

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
			await signup(name, email, password);
			router.push("/");
		} catch (error) {
			setLoading(false);

			setError({
				type: "danger",
				message: "Sorry, something went wrong.",
			});

			console.log(error.code);
		}
	};

	return (
		<Layout title="Sign Up">
			{error && (
				<div className={`alert alert-${error.type}`}>
					{error.message}
				</div>
			)}
			<div className="row d-flex justify-content-center align-items-center w-100 py-3">
				<div className="col-md-6">
					<h2 className="text-center mb-3">Sign Up</h2>
					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label htmlFor="name" className="form-label">
								Name
							</label>
							<input
								id="name"
								className="form-control form-control-lg"
								type="name"
								value={name}
								onChange={handleChange}
								required
							/>
						</div>
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
							<div className="col-md-auto">
								<label
									htmlFor="password"
									className="form-label"
								>
									Password{" "}
									<span className="text-muted small">
										(Minimum 6 characters)
									</span>
								</label>
							</div>

							<input
								id="password"
								className="form-control form-control-lg"
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={handleChange}
								minLength={6}
								required
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
								{loading ? "Signing up..." : "Sign Up"}
							</button>
						</div>
					</form>
				</div>
			</div>
			<div className="w-100 text-center mt-2">
				<Link href="/signin">
					<a>Already have an account? Log In</a>
				</Link>
			</div>
		</Layout>
	);
}

export default SignUpPage;

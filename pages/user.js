import { useState } from "react";
import Link from "next/link";
import { Layout } from "../components/Layout";
import { useAuth } from "../context/AuthContext";

function UserPage() {
	const { currentUser, updateprofile, updatepassword } = useAuth();
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState(null);
	const [editingName, setEditingName] = useState(false);
	const [editingPassword, setEditingPassword] = useState(false);

	const [formData, setFormData] = useState({
		name: currentUser.displayName,
		email: currentUser.email,
		password: "",
	});

	const { name, email, password } = formData;

	const handleChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			setError(null);
			setEditingName(false);
			setEditingPassword(false);

			if (editingName && name !== currentUser.displayName) {
				await updateprofile(name, email, password);
				setError({
					type: "success",
					message: "Great, your name has been saved.",
				});
			}

			if (editingPassword && password) {
				await updatepassword(password);
				setError({
					type: "success",
					message: "Great, your password has been saved.",
				});
				setFormData({ password: "" });
			}

			setLoading(false);
		} catch (error) {
			setLoading(false);
			setError({
				type: "danger",
				message: error.message,
			});
			console.log(error);
		}
	};

	return (
		<Layout title="Profile">
				{error && (
					<div className={`alert alert-${error.type}`}>{error.message}</div>
				)}
				<div className="row d-flex justify-content-center align-items-center w-100 py-3">
					<div className="col-md-6">
						<div className="row">
							<h2 className="text-center mb-3">
								Hello {currentUser && currentUser.displayName}
							</h2>
							<hr className="mb-3" />
						</div>
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
									readOnly
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="name" className="form-label">
									Name
								</label>
								<div className="input-group">
									<input
										id="name"
										type="text"
										value={name}
										onChange={handleChange}
										className="form-control form-control-lg"
										readOnly={!editingName}
									/>
									<button
										className="btn btn-outline-secondary"
										onClick={() =>
											setEditingName(
												(prevState) => !prevState
											)
										}
										title="Change name"
										type="button"
									>
										<i
											className="bi bi-pencil-square"
											style={{ color: "#000" }}
										/>
									</button>
								</div>
							</div>
							<div className="mb-3">
								<label htmlFor="password" className="form-label">
									Password
								</label>
								<div className="input-group">
									<input
										id="password"
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={handleChange}
										className="form-control form-control-lg"
										readOnly={!editingPassword}
									/>
									<button
										className="btn btn-outline-secondary"
										onClick={() =>
											setEditingPassword(
												(prevState) => !prevState
											)
										}
										title="Change password"
										type="button"
									>
										<i
											className="bi bi-pencil-square"
											style={{ color: "#000" }}
										/>
									</button>
								</div>
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
									disabled={
										loading || !(editingName || editingPassword)
									}
									type="submit"
									className="btn btn-primary btn-lg my-3 w-100"
								>
									{loading ? "Saving..." : "Save Details"}
								</button>
							</div>
						</form>
					</div>
				</div>
				<div className="w-100 text-center mt-2">
					<Link href="/">
						<a>
							<i className="bi bi-arrow-left" />
							Back to Main
						</a>
					</Link>
				</div>
		</Layout>
	);
}

export default UserPage;

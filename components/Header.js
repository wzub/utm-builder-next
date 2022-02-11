import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const Header = () => {
	const { currentUser, logout } = useAuth();
	const router = useRouter();

	const onLogout = async () => {
		logout();
		router.push("/signin");
	};

	return (
		<>
			<header className="p-3 py-4 mb-3 border-bottom bg-dark text-white">
				<div className="container">
					<div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
						<Link href="/">
							<a className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									fill="#fff"
									className="bi bi-lightning-charge-fill"
									viewBox="0 0 16 16"
								>
									<path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z" />
								</svg>

								<span className="fs-4 fw-bold ms-1">
									Tagger
								</span>
							</a>
						</Link>

						<ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
							<li className="ms-3 me-3">
								<Link href="/">
									<a className="nav-link px-2 text-white">
										Home
									</a>
								</Link>
							</li>
							<li>
								<a className="nav-link px-2 text-secondary">
									About
								</a>
							</li>
						</ul>

						{currentUser ? (
							<>
								<button
									type="submit"
									className="btn btn-outline-light me-3"
									onClick={onLogout}
								>
									Log out
								</button>
								<div className="dropdown text-end col-auto ">
									<a
										href="#"
										className="d-block link-light text-decoration-none dropdown-toggle"
										id="userdropdown"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									>
										<span className="text-center text-white">
											<span className="avatar avatar-32 img-circle bg-primary">{currentUser?.displayName.charAt(0)}</span>
										</span>
									</a>
									<ul
										className="dropdown-menu text-small"
										aria-labelledby="userdropdown"
										data-popper-placement="bottom-end"
									>
										<li>
											<Link href="/account">
												<a className="dropdown-item">
													Account
												</a>
											</Link>
										</li>
										<li>
											<Link href="/history">
												<a className="dropdown-item">
													History <span className="badge bg-secondary">New</span>
												</a>
											</Link>
										</li>
										<li>
											<a className="dropdown-item text-secondary text-decoration-line-through">
												Settings
											</a>
										</li>
										<li>
											<hr className="dropdown-divider" />
										</li>
										<li>
											<Link href="/" onClick={onLogout}>
												<a className="dropdown-item">
													Logout
												</a>
											</Link>
										</li>
									</ul>
								</div>
							</>
						) : (
							<button
								type="submit"
								className="btn btn-outline-light me-2"
								onClick={() => router.push("/signin")}
							>
								Login
							</button>
						)}
					</div>
				</div>
			</header>
		</>
	);
};

export default Header;

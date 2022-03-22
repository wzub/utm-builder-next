import { useState, useRef } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import fetcher from "../utils/fetcher";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { addSite } from "../lib/db";

function SettingsPage() {
	const { currentUser } = useAuth();
	const [inputs, setInputs] = useState({ site: "" });
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);

	const router = useRouter();
	const newSite = useRef();
	const { mutate } = useSWRConfig();
	const { data, error } = useSWR("/api/sites", fetcher);

	// handle state of form inputs
	const inputsChange = (e) => {
		setInputs((values) => ({ ...values, [e.target.id]: e.target.value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// @TODO: prevent already saved site from being saved again

		setSaving(true);
		try {
			if (!currentUser.accessToken) {
				throw new Error("Authentication error");
			}

			// ensure correctly formatted url
			const urlObj = new URL(`https://${inputs.site}`);
			// always ensure https://
			urlObj.protocol = "https:";

			await addSite(currentUser.uid, urlObj).then(() => {
				// update list
				mutate("/api/sites");
				toast.success(`${urlObj.hostname} added!`);
			});
		} catch (error) {
			toast.error("Sorry, something went wrong");
			console.log(error);
		}
		setSaving(false);
	};

	if (currentUser) {
		if (error || loading) {
			return (
				<Layout>
					<Spinner />
				</Layout>
			);
		}

		return (
			<Layout title="Org Settings">
				<div className="row d-flex justify-content-center align-items-center w-100 py-3">
					<h2 className="text-center mb-3">Settings</h2>
					<hr className="mb-3" />

					<div className="col-md-6">
						<div className="row">
							<h3 className="text-center mb-2">Sites</h3>
							<hr className="mb-3" />
							<ul className="list-group list-group-numbered">
								{data &&
									Object.values(data.sites).map(
										(site, index) => (
											<li
												className="list-group-item"
												key={index}
											>
												{site.domain}
											</li>
										)
									)}
							</ul>
						</div>

						<form
							id="utm_form"
							className="row mt-3 needs-validation"
							onSubmit={handleSubmit}
						>
							<h4>Add a new Site</h4>
							<div className="col mb-3 url form-section">
								<div className="row mb-3">
									<label
										htmlFor="url"
										className="col-md-3 col-form-label-lg"
									>
										URL{" "}
										<small className="text-muted form-text">
											(required)
										</small>
									</label>
									<div className="col-md-9 mb-3">
										<div className="input-group">
											<span class="input-group-text">
												https://
											</span>
											<input
												id="site"
												type="text"
												ref={newSite}
												// pattern="https://.*"
												className="form-control form-control-lg utm_param"
												aria-required="true"
												title="Please enter a domain, e.g. tcf.org.pk"
												required
												value={inputs.site}
												onChange={inputsChange}
											/>
										</div>
										<small className="text-muted form-text">
											Enter the domain only without
											protocol (e.g.{" "}
											<code>tcf.org.pk</code>)
										</small>
									</div>
								</div>
								<div className="row mb-3">
									<button
										type="submit"
										className="btn btn-primary"
										id="savesite"
										aria-label="Save new site"
									>
										<i
											className={`me-1 ${
												saving
													? "spinner-border spinner-border-sm"
													: "bi bi-plus-lg"
											}`}
										></i>
										{saving ? "Saving..." : "Save"}
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</Layout>
		);
	} else {
		toast.error("Please login");
		router.push("/signin");
		return <></>;
	}
}

export default SettingsPage;

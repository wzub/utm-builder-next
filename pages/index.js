import { useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { ValidationProvider } from "../context/ValidationContext";
import { useAuth } from "../context/AuthContext";
import Form from "../components/Form";
import Table from "../components/Table";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const BuildPage = ({ loggedInUser }) => {
	const blankInputs = {
		url: "",
		utm_source: "",
		utm_medium: "",
		utm_campaign: "",
		utm_content: "",
		utm_term: "",
		email: "",
		password: "",
	};

	const [links, setLinks] = useState([]);
	const [inputs, setInputs] = useState(blankInputs);
	const [validation, setValidation] = useState([]);
	const [formChanged, setFormChanged] = useState(false);
	const { currentUser } = useAuth();

	const router = useRouter();

	// handle state of form inputs
	const inputsChange = (e) => {
		const id = e.target.id;
		const value = e.target.value;
		setInputs((values) => ({ ...values, [id]: value }));
		setFormChanged(true);
	};

	const resetForm = (e) => {
		setLinks([]);
		setInputs(blankInputs);
		setFormChanged(false);

		e.target.form.classList.remove("was-validated");
		e.target.form.reset();
	};

	const generateUrl = (formData) => {
		try {
			let url = formData.url,
				params = formData.params,
				selected_sites = formData.selected_sites,
				utms = {},
				generated_links = {};

			// @TODO: clear short link when long URL changes

			// make url a URL obj
			url = new URL(url);

			// always ensure https://
			url.protocol = "https:";

			// utm_source is always required
			if ("utm_custom" in params && params.utm_custom.source === "") {
				throw new ReferenceError("custom utm_source is required");
			}

			Object.assign(utms, selected_sites);

			// get each selected_site
			// prettier-ignore
			for (let [selected_sites_key, selected_sites_value] of Object.entries(utms)) {
				// set entered pathname on each selected site
				selected_sites_value.pathname = url.pathname;
				selected_sites_value.hash = url.hash;

				// get each selected param
				for (let [params_key, params_value] of Object.entries(params)) {
					// create URLs for each params in each selected site using path from url and base of each selected_sites
					utms[selected_sites_key][params_key] = new URL(
						url.pathname,
						selected_sites_value.origin
					);

					// create URLSearchParams of each param
					utms[selected_sites_key][params_key].search =
						new URLSearchParams(params_value);
					utms[selected_sites_key][params_key].hash = url.hash;
				}
			}

			for (let site of Object.values(utms)) {
				// html friendly ID without .
				// pre#tcf_org_pk_utm_facebook
				let site_html_id = site.hostname.replace(/\./g, "_");

				// ready second level of the object
				// generated_links[tcf.org.pk][utm_facebook]
				generated_links[site.hostname] = { link: site.href };

				for (let [source, values] of Object.entries(params)) {
					site[source].searchParams.delete("icon");

					// @TODO: sort for readability
					// site[source].searchParams.sort();

					let newLink = {
						utm_source: values.utm_source,
						utm_url: site[source].href,
						html_id: `${site_html_id}_${source}`,
						icon: values.icon,
						validation: validateUrl(site[source]),
					};

					generated_links[site.hostname][source] = newLink;
				}
			}

			setLinks(generated_links);
			setFormChanged(false);
		} catch (e) {
			console.log(e);
		}
	};

	const validateUrl = (url) => {
		// reset before checking again
		setValidation([]);

		let validation = { type: "warning", message: [] },
			utm_source = url.searchParams.get("utm_source"),
			utm_medium = url.searchParams.get("utm_medium"),
			utm_campaign = url.searchParams.get("utm_campaign"),
			utm_content = url.searchParams.get("utm_content");

		if (utm_source === null) {
			validation.type = "danger";
			validation.message.push("utm_source");
		}

		utm_medium === null && validation.message.push("utm_medium");
		utm_campaign === null && validation.message.push("utm_campaign");
		utm_content === null && validation.message.push("utm_content");

		// setValidation(validation.message.join(", "));
		validation.message.length && setValidation(validation);
	};

	// @Calumah via https://stackoverflow.com/questions/15547198/export-html-table-to-csv-using-vanilla-javascript
	const downloadCsv = (button) => {
		let rows = document.querySelectorAll("table.utm_table tr"),
			csv = [];

		// loop through all tr
		for (var i = 0; i < rows.length; i++) {
			// for each row get source and links inside pre
			let row = [],
				cols = rows[i].querySelectorAll("th, td pre");

			// loop through columns
			for (var j = 0; j < cols.length; j++) {
				// get and clean text of each th, td pre
				// remove multiple spaces and jumpline (break csv)
				// Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
				let data = cols[j].innerText
					.replace(/(\r\n|\n|\r)/gm, "")
					.replace(/(\s\s)/gm, " ")
					.replace(/"/g, '""');

				row.push('"' + data + '"');
			}
			csv.push(row.join(","));
		}

		// convert csv to a set and back again to remove duplicate table headers
		let csv_deduped = Array.from(new Set(csv)),
			csv_string = csv_deduped.join("\n"),
			filename = "utms_" + new Date().toLocaleDateString() + ".csv",
			link = document.createElement("a");

		link.style.display = "none";
		link.setAttribute("target", "_blank");
		link.setAttribute(
			"href",
			"data:text/csv;charset=utf-8," + encodeURIComponent(csv_string)
		);
		link.setAttribute("download", filename);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const makeShortUrl = async (e) => {
		const button = e.currentTarget,
			button_icon = e.currentTarget.querySelector("i"),
			button_text = e.currentTarget.querySelector("span"),
			shortlink_for = button.dataset.for,
			url_display = document.querySelector(
				`pre#${shortlink_for} > code`
			),
			shorturl_display = document.querySelector(
				`pre#${shortlink_for}_shortlink code`
			),
			options = {
				method: "POST",
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
					"Content-Type": "application/json",
				},
				url: "/api/shorten",
				data: JSON.stringify({
					url: url_display.textContent,
				}),
			};

		button_icon.classList.add("spinner-border", "spinner-border-sm");
		button_icon.classList.remove("bi-lightning-charge-fill");
		button_text.textContent = "Making...";

		try {
			if (!currentUser.accessToken) {
				// toast.error("Authentication error")
				throw new Error("Authentication error");
			}

			await axios(options)
				.then((response) => {
					// console.log(response);

					if (response.status === 200) {
						button_text.textContent = "Make";
						shorturl_display.textContent = response.data.link;
					}
				})
				.catch((error) => {
					button_text.textContent = "Retry";
					toast.error(error.response.data);
				});

			button_icon.classList.remove("spinner-border", "spinner-border-sm");
			button_icon.classList.add("bi-lightning-charge-fill");
		} catch (error) {
			toast.error("Sorry, something went wrong");
			console.log(error);
		}
	};

	if (currentUser) {
		return (
			<Layout title="">
				<Form
					inputs={inputs}
					onChange={inputsChange}
					onGenerate={generateUrl}
					onReset={resetForm}
					onDownload={downloadCsv}
				/>

				<div id="utm_container" className="container-md my-md-3">
					<div
						id="utm_display"
						className="display bg-light border my-2 p-md-5 p-3"
					>
						<div className="row">
							{Object.keys(links).length > 0 ? (
								<>
									<div md="auto" className="col me-auto">
										<h2 className="display-6 me-auto">
											Generated UTM links
										</h2>
									</div>
									<div className="col-md-auto d-flex align-items-center">
										<button
											type="submit"
											className="btn btn-outline-secondary col-md-auto"
											id="download_csv"
											aria-label="Download CSV"
											onClick={downloadCsv}
										>
											<i className="bi bi-download me-1" />
											Download CSV
										</button>
									</div>
									<hr className="my-4" />
									{formChanged ? (
										<p id="form_edited_notice">
											<i className="bi bi-info-circle me-1" />
											Form has changed. Click{" "}
											<code>Generate</code> to refresh the
											table below.
										</p>
									) : null}
								</>
							) : (
								<div
									id="default_notice"
									className="row align-items-center"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="46"
										height="46"
										fill="lightgray"
										className="bi bi-table d-block"
										viewBox="0 0 16 16"
									>
										<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z" />
									</svg>
									<p
										id="default_notice"
										className="text-center text-black-50 mt-md-3"
									>
										Click Generate to build some URLs.
									</p>
								</div>
							)}
							<div className="row" id="utm_table_container">
								<ValidationProvider>
									<Table
										onShorten={makeShortUrl}
										validation={validation}
										links={links}
									/>
								</ValidationProvider>
							</div>
						</div>
					</div>
				</div>
			</Layout>
		);
	} else {
		toast.error("Please login");
		router.push("/signin");
		return <></>;
	}
};

export default BuildPage;

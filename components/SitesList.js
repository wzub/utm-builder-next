import useSWR from "swr";
import fetcher from "../utils/fetcher";

const SitesList = () => {
	const { data, error } = useSWR("/api/sites", fetcher);

	if (data) {
		return (
			<div
				className="selected_sites col-md-9 offset-md-3 btn-group"
				role="group"
				aria-label="Sites"
			>
				{data &&
					Object.values(data.sites).map((site, index) => (
						<div className="btn-group" key={site.id}>
							<input
								type="checkbox"
								className="btn-check sites"
								id={site.domain.replace(/\./g, "_")}
								value={site.url}
								// defaultChecked
							/>
							<label
								className="btn btn-outline-primary"
								htmlFor={site.domain.replace(/\./g, "_")}
							>
								{site.domain}
							</label>
						</div>
					))}
			</div>
		);
	}
	else {
		return (
			<div className="placeholder-glow col-md-9 offset-md-3 btn-group">
      			<span className="placeholder col-3">No sites added</span>
			</div>
		)
	}

	/*
	return (
		<div
			className="selected_sites col-md-9 offset-md-3"
			role="group"
			aria-label="Sites"
		>
			<input
				type="checkbox"
				className="btn-check sites"
				id="site_pk"
				value="https://tcf.org.pk"
				defaultChecked
			/>
			<label className="btn btn-outline-primary" htmlFor="site_pk">
				tcf.org.pk
			</label>
			<input
				type="checkbox"
				className="btn-check sites"
				id="site_uk"
				value="https://tcf-uk.org"
			/>
			<label className="btn btn-outline-primary" htmlFor="site_uk">
				tcf-uk.org
			</label>
			<input
				type="checkbox"
				className="btn-check sites"
				id="site_us"
				value="https://tcfusa.org"
			/>
			<label className="btn btn-outline-primary" htmlFor="site_us">
				tcfusa.org
			</label>
			<input
				type="checkbox"
				className="btn-check sites"
				id="site_ca"
				value="https://tcfcanada.org"
			/>
			<label className="btn btn-outline-primary" htmlFor="site_ca">
				tcfcanada.org
			</label>
			<input
				type="checkbox"
				className="btn-check sites"
				id="site_au"
				value="https://tcfaustralia.org"
			/>
			<label className="btn btn-outline-primary" htmlFor="site_au">
				tcfaustralia.org
			</label>
			<input
				type="checkbox"
				className="btn-check sites"
				id="site_no"
				value="https://tcfnorway.org"
			/>
			<label className="btn btn-outline-primary" htmlFor="site_no">
				tcfnorway.org
			</label>
			<div className="row">
				<small className="text-muted form-text">
					Select the sites for which you want to generate UTM
					parameters
				</small>
			</div>
		</div>
	);
	*/
};

export default SitesList;

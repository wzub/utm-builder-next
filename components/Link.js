
// prettier-ignore
const Link = ({onShorten: makeShortUrl, link, validation}) => {

	const copyUrl = (e) => {
		let btn_icon = e.currentTarget.querySelector("i"),
			btn_text = e.currentTarget.querySelector("span"),
			url_container = document.querySelector(`#${e.currentTarget.dataset.for}`);

		navigator.clipboard
			.writeText(url_container.textContent)
			.then(() => {
				btn_text.textContent = "Copied!";
				// btn_icon.classList.replace("bi-clipboard-plus", "bi-clipboard-check");
				
				setTimeout(() => {
					btn_text.textContent = "Copy";
					// btn_icon.classList.replace("bi-clipboard-check", "bi-clipboard-plus");
				}, 1000);

				console.log(`Copied ${url_container.textContent}`);
			})
			.catch((err) => {
				console.log("Couldn't copy", err);
			});
		
		// url_container.click();
	};

	const shortenUrl = (e) => makeShortUrl(e);

	return (
		<tr key={link.html_id}>
			<th scope="row" className="p-md-3 text-capitalize">
				<i className={`bi me-1 ${link.icon}`} title={`${link.utm_source}`}></i>
				{link.utm_source}
			</th>
			<td className="position-relative">
				<pre id={`${link.html_id}`} className="border p-2 utm_display text-dark bg-body text-break mb-1"><code className="user-select-all">{link.utm_url}</code></pre>
					<button
						type="button"
						className="btn btn-outline-primary copy-url col-auto"
						data-for={`${link.html_id}`}
						title="Copy full URL"
						onClick={copyUrl}
					>
						<i className="bi bi-clipboard-plus" /> <span>Copy URL</span>
					</button>
				{validation.message && validation.message.length > 0 ? (
				<div className={`alert alert-${validation.type} d-flex align-items-top my-1 P`} role="alert">
					<i className="bi bi-info-circle-fill me-3" />
					<div>
						{validation.type === "danger" ? (
							<>
								Missing: 
								<strong>
									{validation.message.join(", ")}
								</strong>
							</>
						) : (
							<>
								Consider adding {" "}
								<strong>
									{validation.message.join(", ")}
								</strong>
							</>
						)}
					</div>
				</div>
				) : null}
			</td>
			<td>
				<pre id={`${link.html_id}_shortlink`} className="border p-2 shortlinks_display text-dark bg-body text-break mb-1"><code className="user-select-all"></code></pre>
				<div className="btn-group" role="group">
					<button
						type="submit"
						className="btn btn-outline-secondary generate_shorlinks col-auto ms-auto"
						aria-label="Generate short links"
						data-for={`${link.html_id}`}
						title="Make short links"
						onClick={shortenUrl}
					>
						<i className="bi bi-lightning-charge-fill" /> <span>Make</span>
					</button>
					<button
						type="button"
						className="btn btn-outline-secondary copy-url col-auto"
						data-for={`${link.html_id}_shortlink`}
						title="Copy shortlinks"
						onClick={copyUrl}
					>
						<i className="bi bi-clipboard-plus" /> <span>Copy</span>
					</button>
				</div>
			</td>
		</tr>
	);
}

export default Link;

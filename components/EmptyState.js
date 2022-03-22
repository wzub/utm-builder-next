const EmptyState = () => {
	return (
		<div id="default_notice" className="row align-items-center">
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
				Generate some links to see them here
			</p>
		</div>
	);
};

export default EmptyState;

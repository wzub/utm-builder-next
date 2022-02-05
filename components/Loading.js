import React from "react";

const Loading = () => {
	return (
		<div className="container my-5 text-center">
			<div className="spinner-grow" role="status">
				<span className="visually-hidden">Loading...</span>
			</div>
		</div>
	);
};

export default Loading;

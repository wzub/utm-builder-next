import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "../utils/fetcher";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import HistoryTable from "../components/HistoryTable";
import EmptyState from "../components/EmptyState";

function HistoryPage() {
	const { currentUser } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const router = useRouter();

	// @TODO: sortable/pagination table

	if (currentUser) {
		const { data, error } = useSWR("/api/links", fetcher);
		// setLoading(false);

		if (error || loading) {
			return (
				<Layout>
					<Spinner />
				</Layout>
			);
		}

		if (data) {
			return (
				<Layout title="Shortlink Log">
					<div className="row d-flex justify-content-center align-items-center w-100 py-3">
						<div className="col-md-6">
							<div className="row">
								<h2 className="text-center mb-3">Link Log</h2>
								<hr className="mb-3" />
							</div>
						</div>
					</div>

					<HistoryTable data={data.links} />

				</Layout>
			);
		} else {
			return (
				<Layout title="Shortlink Log">
					<div className="row d-flex justify-content-center align-items-center w-100 py-3">
						<div className="col-md-6">
							<div className="row">
								<h2 className="text-center mb-3">Link Log</h2>
								<hr className="mb-3" />
							</div>
						</div>
					</div>
					<EmptyState />
				</Layout>
			);
		}
	} else {
		toast.error("Please login");
		router.push("/signin");
		return <></>;
	}
}

export default HistoryPage;

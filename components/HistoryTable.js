import { useMemo, useState } from "react";
import {
	useTable,
	useFilters,
	useGlobalFilter,
	useSortBy,
	usePagination,
} from "react-table";
import { format, toDate, formatDistanceToNow } from "date-fns";

function DefaultColumnFilter({
	column: { filterValue, preFilteredRows, setFilter },
}) {
	const count = preFilteredRows.length;

	return (
		<input
			className="form-control"
			value={filterValue || ""}
			onChange={(e) => {
				setFilter(e.target.value || undefined);
			}}
			placeholder={`Search ${count} records...`}
		/>
	);
}

function Table({ columns, data }) {
	const defaultColumn = useMemo(
		() => ({
			// Default Filter UI
			Filter: DefaultColumnFilter,
		}),
		[]
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		state,
		preGlobalFilteredRows,
		page,
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize },
	} = useTable(
		{
			columns,
			data,
			defaultColumn,
			initialState: { pageIndex: 0, pageSize: 10 },
		},
		useFilters,
		useSortBy,
		usePagination
	);

	return (
		<div>
			<table
				className="table table-responsive table-hover caption-top align-top mb-4 mw-100 "
				{...getTableProps()}
			>
				<thead className="table-dark">
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<th
									scope="col"
									{...column.getHeaderProps(
										column.getSortByToggleProps()
									)}
								>
									{column.render("Header")}
									<span className="ms-auto">
										{column.isSorted ? (
											column.isSortedDesc ? (
												<i className="bi bi-sort-down"></i>
											) : (
												<i className="bi bi-sort-down-alt"></i>
											)
										) : (
											""
										)}
									</span>
									<div>
										{column.canFilter
											? column.render("Filter")
											: null}
									</div>
								</th>
							))}
						</tr>
					))}
				</thead>

				<tbody {...getTableBodyProps()}>
					{page.map((row, i) => {
						prepareRow(row);
						return (
							<tr {...row.getRowProps()}>
								{row.cells.map((cell) => {
									return (
										<td {...cell.getCellProps()}>
											{cell.render("Cell")}
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>

			<div className="row justify-content-center">
				<div className="col-auto me-auto">
					<nav aria-label="Pagination">
						<ul className="pagination">
							<li
								className={`page-item ${
									canPreviousPage ? "" : "disabled"
								}`}
								onClick={() => previousPage()}
								disabled={!canPreviousPage}
							>
								<a href="#" className="page-link">
									Previous
								</a>
							</li>
							<li className="page-item">
								<a className="page-link">
									Page {pageIndex + 1} of {pageOptions.length}
								</a>
							</li>
							<li
								className={`page-item ${
									canNextPage ? "" : "disabled"
								}`}
								onClick={() => nextPage()}
								disabled={!canNextPage}
							>
								<a className="page-link" href="#">
									Next
								</a>
							</li>
						</ul>
					</nav>
				</div>

				<div className="col-auto">
					<select
						className="form-control form-select"
						value={pageSize}
						onChange={(e) => {
							setPageSize(Number(e.target.value));
						}}
					>
						{[2, 5, 10, 50].map((pageSize) => (
							<option key={pageSize} value={pageSize}>
								Show {pageSize}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}

function HistoryTable({ data }) {
	const columns = useMemo(
		() => [
			{
				Header: "Links",
				columns: [
					{
						Header: "Created",
						accessor: "created",
						isSorted: true,
						isSortedDesc: false,
						Cell: (props) => {
							// prettier-ignore
							// return <span>{format(toDate(props.value.seconds * 1000),"PPpp")}</span>
							const dateObj = toDate(props.value.seconds * 1000);
							return (
								<span title={format(dateObj, "PPpp")}>
									{formatDistanceToNow(dateObj)} ago
								</span>
							);
						},
					},
					{
						Header: "Domain",
						accessor: "domain",
					},
					{
						Header: "Full link",
						accessor: "link",
					},
					{
						Header: "Short link",
						accessor: "shortlink",
					},
				],
			},
		],
		[]
	);

	return <Table columns={columns} data={data} />;
}

export default HistoryTable;

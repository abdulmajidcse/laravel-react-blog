import axios from "../../../utils/axios-instance";
import Loading from "../../../components/Loading";
import { Link, useSearchParams } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import swal from "sweetalert";
import moment from "moment";
import { useState, useEffect, useMemo } from "react";
import { useTable } from "react-table";

export default function CategoryIndexReactTable() {
    let [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const columns = useMemo(
        () => [
            {
                Header: "SL",
                accessor: "sl",
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Created Date",
                accessor: "created_date",
            },
            {
                Header: "Action",
                accessor: "action",
            },
        ],
        []
    );

    const data = useMemo(
        () =>
            categories.data
                ? categories.data.map((category, index) => ({
                      sl: ++index,
                      name: category.name,
                      created_date: moment(category.created_at).format(
                          "DD-MM-YYYY LT"
                      ),
                      action: (
                          <>
                              <Link
                                  to={`/auth/categories/${category.id}/edit`}
                                  className="btn btn-sm btn-primary me-1"
                              >
                                  Edit
                              </Link>
                              <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => deleteCategory(category.id)}
                              >
                                  Delete
                              </Button>
                          </>
                      ),
                  }))
                : [],
        [categories]
    );

    const tableInstance = useTable({ columns, data });
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        tableInstance;

    useEffect(() => {
        setLoading(true);
        axios
            .get(
                `/auth/categories?paginate=4&page=${
                    searchParams.get("page") ?? 1
                }`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            process.env.MIX_AUTH_TOKEN_NAME
                        )}`,
                    },
                }
            )
            .then((response) => {
                setCategories(response.data.data);
                setPageCount(response.data.data.last_page);
                setItemOffset(response.data.data.from);
                setCurrentPage(response.data.data.current_page - 1);
                setLoading(false);
            })
            .catch((error) => {
                setCategories([]);
                setLoading(false);
            });
    }, [searchParams]);

    const deleteCategory = (categoryId) => {
        swal({
            text: "Are you want to delete?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                setLoading(true);
                axios
                    .delete(`/auth/categories/${categoryId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                process.env.MIX_AUTH_TOKEN_NAME
                            )}`,
                        },
                    })
                    .then((response) => {
                        const categoryListUpdated = categories.data?.filter(
                            (category) => category.id !== categoryId
                        );
                        setCategories((prevCategories) => ({
                            ...prevCategories,
                            data: categoryListUpdated,
                        }));
                        toast.success(response.data.message);
                        setLoading(false);
                    })
                    .catch((error) => {
                        toast.error(error.message ?? "Failed to delete!");
                        setLoading(false);
                    });
            }
        });
    };

    return (
        <>
            <Loading loadingIs={loading} />
            <div className="container mt-3">
                <div className="card">
                    <div className="card-header d-block d-md-flex">
                        <h3 className="flex-md-grow-1">Category List</h3>
                        <div>
                            <Link
                                to="/auth/categories/create"
                                className="btn btn-sm btn-primary"
                            >
                                Add New
                            </Link>
                        </div>
                    </div>
                    <div className="card-body">
                        <Table responsive bordered hover {...getTableProps()}>
                            <thead>
                                {
                                    // Loop over the header rows
                                    headerGroups.map((headerGroup) => (
                                        // Apply the header row props
                                        <tr
                                            {...headerGroup.getHeaderGroupProps()}
                                        >
                                            {
                                                // Loop over the headers in each row
                                                headerGroup.headers.map(
                                                    (column) => (
                                                        // Apply the header cell props
                                                        <th
                                                            {...column.getHeaderProps()}
                                                        >
                                                            {
                                                                // Render the header
                                                                column.render(
                                                                    "Header"
                                                                )
                                                            }
                                                        </th>
                                                    )
                                                )
                                            }
                                        </tr>
                                    ))
                                }
                            </thead>
                            {/* Apply the table body props */}
                            <tbody {...getTableBodyProps()}>
                                {
                                    // Loop over the table rows
                                    rows.map((row) => {
                                        // Prepare the row for display
                                        prepareRow(row);
                                        return (
                                            // Apply the row props
                                            <tr {...row.getRowProps()}>
                                                {
                                                    // Loop over the rows cells
                                                    row.cells.map((cell) => {
                                                        // Apply the cell props
                                                        return (
                                                            <td
                                                                {...cell.getCellProps()}
                                                            >
                                                                {
                                                                    // Render the cell contents
                                                                    cell.render(
                                                                        "Cell"
                                                                    )
                                                                }
                                                            </td>
                                                        );
                                                    })
                                                }
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    );
}

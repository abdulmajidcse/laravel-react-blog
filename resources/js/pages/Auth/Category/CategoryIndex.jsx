import axios from "../../../utils/axios-instance";
import Loading from "../../../components/Loading";
import { Link } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import swal from "sweetalert";
import moment from "moment";
import useGetModel from "../../../hooks/useGetModel";
import { useState, useMemo } from "react";
import { useTable } from "react-table";

export default function CategoryIndex() {
    const [loading, setLoading] = useState(false);
    let categories = useGetModel(
        "/auth/categories",
        localStorage.getItem(process.env.MIX_AUTH_TOKEN_NAME)
    );
    const data = useMemo(
        () =>
            categories.data
                ? categories.data.map((category, index) => ({
                      sl: ++index,
                      name: category.name,
                      created_at: moment(category.created_at).format(
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
        [categories, categories.data]
    );

    const columns = useMemo(
        () => [
            {
                Header: "SL",
                accessor: "sl", // accessor is the "key" in the data
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Created At",
                accessor: "created_at",
            },
            {
                Header: "Action",
                accessor: "action",
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data });

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
                        categories.data = categories.data?.filter(
                            (category) => category.id !== categoryId
                        );
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
            <Loading loadingIs={loading || !categories.data} />
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
                                {headerGroups.map((headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => (
                                            <th {...column.getHeaderProps()}>
                                                {column.render("Header")}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                                {rows.map((row) => {
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map((cell) => {
                                                return (
                                                    <td
                                                        {...cell.getCellProps()}
                                                    >
                                                        {cell.render("Cell")}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    );
}

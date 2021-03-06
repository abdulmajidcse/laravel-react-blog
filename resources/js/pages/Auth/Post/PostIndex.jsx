import axios from "../../../utils/axios-instance";
import Loading from "../../../components/Loading";
import { Link, useSearchParams } from "react-router-dom";
import { Table, ButtonGroup, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import swal from "sweetalert";
import moment from "moment";
import { useState, useEffect, useMemo } from "react";
import { useTable, usePagination } from "react-table";

export default function PostIndex() {
    let [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    const columns = useMemo(
        () => [
            {
                Header: "SL",
                accessor: "sl",
            },
            {
                Header: "Title",
                accessor: "title",
            },
            {
                Header: "Category",
                accessor: "category",
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
            posts.data
                ? posts.data.map((post, index) => ({
                      sl: itemOffset + index,
                      title: post.title,
                      category: post.category.name,
                      created_date: moment(post.created_at).format(
                          "DD-MM-YYYY LT"
                      ),
                      action: (
                          <>
                              <ButtonGroup aria-label="Post Action">
                                  <Link
                                      to={`/auth/posts/${post.id}`}
                                      className="btn btn-sm btn-success me-1"
                                  >
                                      View
                                  </Link>
                                  <Link
                                      to={`/auth/posts/${post.id}/edit`}
                                      className="btn btn-sm btn-primary me-1"
                                  >
                                      Edit
                                  </Link>
                                  <Button
                                      variant="danger"
                                      size="sm"
                                      onClick={() => deletePost(post.id)}
                                  >
                                      Delete
                                  </Button>
                              </ButtonGroup>
                          </>
                      ),
                  }))
                : [],
        [posts]
    );

    const tableInstance = useTable(
        {
            columns,
            data,
            initialState: {
                pageIndex: searchParams.has("page")
                    ? searchParams.get("page") - 1
                    : 0,
            },
            manualPagination: true,
            pageCount: totalPage,
        },
        usePagination
    );
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        // Get the state from the instance
        state: { pageIndex, pageSize },
    } = tableInstance;

    useEffect(() => {
        setLoading(true);
        axios
            .get(
                `/auth/posts?paginate=${pageSize}&page=${
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
                setPosts(response.data.data);
                setTotalPage(response.data.data.last_page);
                setItemOffset(response.data.data.from);
                setLoading(false);

                response.data.data.last_page < searchParams.get("page") &&
                    setSearchParams({ page: 1 });
            })
            .catch((error) => {
                setPosts([]);
                setLoading(false);
            });
    }, [pageSize, searchParams]);

    const deletePost = (postId) => {
        swal({
            text: "Are you want to delete?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                setLoading(true);
                axios
                    .delete(`/auth/posts/${postId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                process.env.MIX_AUTH_TOKEN_NAME
                            )}`,
                        },
                    })
                    .then((response) => {
                        const postListUpdated = posts.data?.filter(
                            (post) => post.id !== postId
                        );
                        setPosts((prevposts) => ({
                            ...prevposts,
                            data: postListUpdated,
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
                        <h3 className="flex-md-grow-1">Post List</h3>
                        <div>
                            <Link
                                to="/auth/posts/create"
                                className="btn btn-sm btn-primary"
                            >
                                Add New
                            </Link>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="mb-1">
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                }}
                                className="form-control d-inline w-auto"
                            >
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize} Rows
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Table responsive bordered hover {...getTableProps()}>
                            <thead>
                                {headerGroups.map((headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => (
                                            <th {...column.getHeaderProps()}>
                                                {column.render("Header")}
                                                <span>
                                                    {column.isSorted
                                                        ? column.isSortedDesc
                                                            ? " ????"
                                                            : " ????"
                                                        : ""}
                                                </span>
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

                        <div className="row">
                            <div className="col-md-6 mb-md-0 mb-1">
                                Page:{" "}
                                <input
                                    type="number"
                                    value={pageIndex + 1}
                                    onChange={(e) => {
                                        const page = e.target.value
                                            ? Number(e.target.value) - 1
                                            : 1;
                                        gotoPage(page);
                                        setSearchParams({ page: page + 1 });
                                    }}
                                    className="form-control d-inline w-auto me-1"
                                    min="1"
                                    max={pageCount}
                                />
                                of {pageOptions.length}
                            </div>
                            <div className="col-md-6">
                                <ul className="pagination float-md-end">
                                    <li
                                        className={`page-item ${
                                            !canPreviousPage && "disabled"
                                        }`}
                                        title="First Page"
                                    >
                                        <button
                                            onClick={() => {
                                                gotoPage(0);
                                                setSearchParams({ page: 1 });
                                            }}
                                            disabled={!canPreviousPage}
                                            className="page-link"
                                        >
                                            <span aria-hidden="true">
                                                &laquo;
                                            </span>
                                        </button>
                                    </li>{" "}
                                    <li
                                        className={`page-item ${
                                            !canPreviousPage && "disabled"
                                        }`}
                                        title="Previous Page"
                                    >
                                        <button
                                            onClick={() => {
                                                previousPage();
                                                setSearchParams({
                                                    page: pageIndex,
                                                });
                                            }}
                                            disabled={!canPreviousPage}
                                            className="page-link"
                                        >
                                            Previous
                                        </button>
                                    </li>{" "}
                                    <li
                                        className={`page-item ${
                                            !canNextPage && "disabled"
                                        }`}
                                        title="Next Page"
                                    >
                                        <button
                                            onClick={() => {
                                                nextPage();
                                                setSearchParams({
                                                    page: pageIndex + 2,
                                                });
                                            }}
                                            disabled={!canNextPage}
                                            className="page-link"
                                        >
                                            Next
                                        </button>
                                    </li>{" "}
                                    <li
                                        className={`page-item ${
                                            !canNextPage && "disabled"
                                        }`}
                                        title="Last Page"
                                    >
                                        <button
                                            onClick={() => {
                                                gotoPage(pageCount - 1);
                                                setSearchParams({
                                                    page: pageCount,
                                                });
                                            }}
                                            disabled={!canNextPage}
                                            className="page-link"
                                        >
                                            <span aria-hidden="true">
                                                &raquo;
                                            </span>
                                        </button>
                                    </li>{" "}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

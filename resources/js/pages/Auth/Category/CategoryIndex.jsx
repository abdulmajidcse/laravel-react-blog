import axios from "../../../utils/axios-instance";
import Loading from "../../../components/Loading";
import { Link, useSearchParams } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import swal from "sweetalert";
import moment from "moment";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

export default function CategoryIndex() {
    let [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

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

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        setSearchParams({ page: ++event.selected });
    };

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
                        <Table responsive bordered hover>
                            <thead>
                                <tr>
                                    <td>SL</td>
                                    <td>Name</td>
                                    <td>Created Date</td>
                                    <td>Action</td>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.data?.map((category, index) => (
                                    <tr key={`category_id_${category.id}`}>
                                        <td>{itemOffset + index}</td>
                                        <td>{category.name}</td>
                                        <td>
                                            {moment(category.created_at).format(
                                                "DD-MM-YYYY LT"
                                            )}
                                        </td>
                                        <td>
                                            <Link
                                                to={`/auth/categories/${category.id}/edit`}
                                                className="btn btn-sm btn-primary me-1"
                                            >
                                                Edit
                                            </Link>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() =>
                                                    deleteCategory(category.id)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <ReactPaginate
                            containerClassName="pagination justify-content-end"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            activeClassName="active"
                            activeLinkClassName="active disabled"
                            disabledClassName="disabled"
                            disabledLinkClassName="disabled"
                            previousClassName="page-item"
                            nextClassName="page-item"
                            previousLinkClassName="page-link"
                            nextLinkClassName="page-link"
                            breakLabel="..."
                            previousLabel="&laquo;"
                            nextLabel="&raquo;"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            forcePage={currentPage}
                            renderOnZeroPageCount={null}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

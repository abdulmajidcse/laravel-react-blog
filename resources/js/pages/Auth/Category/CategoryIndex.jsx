import axios from "../../../utils/axios-instance";
import Loading from "../../../components/Loading";
import { Link } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import swal from "sweetalert";
import moment from "moment";
import useGetModel from "../../../hooks/useGetModel";
import { useState } from "react";

export default function CategoryIndex() {
    const [loading, setLoading] = useState(false);
    let categories = useGetModel(
        "/auth/categories",
        localStorage.getItem(process.env.MIX_AUTH_TOKEN_NAME)
    );

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
                        <Table responsive bordered hover>
                            <thead>
                                <tr>
                                    <th>SL</th>
                                    <th>Name</th>
                                    <th>Created At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.data?.map((category, index) => (
                                    <tr key={`category_id_${category.id}`}>
                                        <td>{++index}</td>
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
                    </div>
                </div>
            </div>
        </>
    );
}

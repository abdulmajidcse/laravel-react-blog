import axios from "../../../utils/axios-instance";
import Loading from "../../../components/Loading";
import { Link } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import swal from "sweetalert";

export default function CategoryIndex() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await axios.get("/auth/categories", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            process.env.MIX_AUTH_TOKEN_NAME
                        )}`,
                    },
                });

                if (response) {
                    setCategories(response.data.data);
                    setLoading(false);
                }
            } catch (error) {
                toast.error(error.message ?? "Failed to load!");
                setLoading(false);
            }
        };

        loadCategories();

        return () => {
            setCategories([]);
        };
    }, []);

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
                        setCategories((prevCategoreis) =>
                            prevCategoreis.filter(
                                (prevCategory) => prevCategory.id !== categoryId
                            )
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
            <Loading loadingIs={loading} />
            <div className="container mt-3">
                <div className="card">
                    <div className="card-header d-block d-md-flex">
                        <h3 className="flex-md-grow-1">Category List</h3>
                        <div>
                            <Link
                                to="/auth/categories"
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
                                {categories.map((category, index) => (
                                    <tr key={`category_id_${category.id}`}>
                                        <td>{++index}</td>
                                        <td>{category.name}</td>
                                        <td>{category.created_at}</td>
                                        <td>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="me-1"
                                            >
                                                Edit
                                            </Button>
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

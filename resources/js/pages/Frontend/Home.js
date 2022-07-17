import axios from "../../utils/axios-instance";
import Loading from "../../components/Loading";
import { Link, useSearchParams } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import swal from "sweetalert";
import moment from "moment";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

export default function Home() {
    let [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        setLoading(true);
        axios
            .get(
                `/posts?paginate=3&page=${searchParams.get("page") ?? 1}`,
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
                setPageCount(response.data.data.last_page);
                setItemOffset(response.data.data.from);
                setCurrentPage(response.data.data.current_page - 1);
                setLoading(false);
            })
            .catch((error) => {
                setPosts([]);
                setLoading(false);
            });
    }, [searchParams]);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        setSearchParams({ page: ++event.selected });
    };

    return (
        <>
            <Loading loadingIs={loading} />
            <div className="container mt-3">
                <div className="card">
                    <div className="card-body">
                        {posts.data?.length > 0 ? (
                            <>
                                {posts.data?.map((post, index) => (
                                    <div key={`post_id_${post.id}`}>
                                        <h2>{post.title}</h2>
                                        <p>
                                            <small>
                                                {moment(post.created_at).format(
                                                    "DD-MM-YYYY LT"
                                                )}
                                            </small>
                                        </p>
                                        {post.photo && (
                                            <img
                                                src={`${process.env.MIX_APP_URL}/uploads/${post.photo}`}
                                                alt="Preview"
                                                height={100}
                                            />
                                        )}
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: post.content,
                                            }}
                                        />
                                    </div>
                                ))}
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
                            </>
                        ) : (
                            <h3 className="text-danger text-center">
                                Coming soon...
                            </h3>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

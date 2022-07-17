import axios from "../../../utils/axios-instance";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import NotFound from "../../NotFound";
import moment from "moment";

export default function PostView() {
    const { postId } = useParams();
    const [post, setPost] = useState({});
    const [notFound, setNotFound] = useState(false);
    useEffect(() => {
        axios
            .get(`/auth/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        process.env.MIX_AUTH_TOKEN_NAME
                    )}`,
                },
            })
            .then((response) => {
                setPost(response.data.data);
            })
            .catch((error) => {
                setPost({});
                setNotFound(true);
            });
        return () => {
            setPost({});
        };
    }, []);

    if (notFound) {
        return <NotFound />;
    }

    return (
        <>
            <div className="container mt-3">
                <div className="card">
                    <div className="card-header d-block d-md-flex">
                        <h3 className="flex-md-grow-1">View Post</h3>
                        <div>
                            <Link
                                to="/auth/posts"
                                className="btn btn-sm btn-primary"
                            >
                                Post List
                            </Link>
                        </div>
                    </div>
                    <div className="card-body">
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
                        <div>{post.content}</div>
                        {/* <div dangerouslySetInnerHTML={{_html: post.content}} /> */}
                    </div>
                </div>
            </div>
        </>
    );
}

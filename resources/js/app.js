import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom/client";
import InitApp from "./InitApp";
import { BrowserRouter } from "react-router-dom";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

if (process.env.NODE_ENV === "production") {
    disableReactDevTools();
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <InitApp />
        <ToastContainer />
    </BrowserRouter>
);

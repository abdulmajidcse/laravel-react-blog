import ReactDOM from "react-dom/client";
import InitApp from "./InitApp";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <InitApp />
    </BrowserRouter>
);

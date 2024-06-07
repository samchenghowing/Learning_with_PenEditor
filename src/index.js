import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import Editor from "./pages/runjs";
import ErrorPage from "./pages/error-page";
import Home from "./pages/home-page";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Editor />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/editor",
        element: <Home />,
        errorElement: <ErrorPage />,
    },
]);

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

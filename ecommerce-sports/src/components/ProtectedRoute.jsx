import { Navigate } from "react-router-dom";

// Protected Route - Only for logged in users
export const ProtectedRoute = ({ children }) => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Admin Route - Only for admin users
export const AdminRoute = ({ children }) => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const role = sessionStorage.getItem("role");

    if (isLoggedIn !== "true") {
        return <Navigate to="/login" replace />;
    }

    if (role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

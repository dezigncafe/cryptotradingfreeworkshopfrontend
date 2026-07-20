import {
    Navigate,
    Route,
    Routes,
} from 'react-router-dom';

import Home from './Pages/Home';
// import AdminLogin from './Pages/Admin/AdminLogin';


function ProtectedRoute({ children }) {
    const accessToken =
        localStorage.getItem('access_token');

    if (!accessToken) {
        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );
    }

    return children;
}

export default function AppRouter() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Home />}
            />

          
        </Routes>
    );
}
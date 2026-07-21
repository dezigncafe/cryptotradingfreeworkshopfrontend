import { Outlet, useNavigate } from 'react-router-dom';

import AdminSidebar from '../Components/Admin/AdminSidebar';
import AdminTopbar from '../Components/Admin/AdminTopbar';
import api from '../services/api';

export default function AdminLayout() {
    const navigate = useNavigate();

    const storedUser =
        localStorage.getItem('admin_user');

    const user = storedUser
        ? JSON.parse(storedUser)
        : null;

    const handleLogout = async () => {
        try {
            await api.post('/admin/logout');
        } catch {
            // Remove local credentials even if API fails.
        } finally {
            localStorage.removeItem(
                'admin_access_token',
            );

            localStorage.removeItem(
                'admin_user',
            );

            navigate('/admin/login', {
                replace: true,
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <AdminSidebar />

            <div className="lg:pl-72">
                <AdminTopbar
                    user={user}
                    onLogout={handleLogout}
                />

                <main className="p-5 sm:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
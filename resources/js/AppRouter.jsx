import {
    Navigate,
    Route,
    Routes,
} from 'react-router-dom';

import AdminLayout from './Layouts/AdminLayout';
import AdminProtectedRoute from './Routes/AdminProtectedRoute';

import Home from './Pages/Home';

import AdminDashboard from './Pages/Admin/Dashboard';
import AdminLogin from './Pages/Admin/Login';
import PlaceholderPage from './Pages/Admin/PlaceholderPage';

import WorkshopIndex from './Pages/Admin/Workshops/Index';
import WorkshopForm from './Pages/Admin/Workshops/Form';

import RegistrationIndex from './Pages/Admin/Registrations/Index';

import TrainerIndex from './Pages/Admin/Trainers/Index';
import TrainerForm from './Pages/Admin/Trainers/Form';

import WorkshopShow from './Pages/Admin/Workshops/Show';

export default function AppRouter() {
    return (
        <Routes>
            {/* Public website */}
            <Route
                path="/"
                element={<Home />}
            />

            {/* Admin login */}
            <Route
                path="/admin/login"
                element={<AdminLogin />}
            />

            {/* Protected admin routes */}
            <Route element={<AdminProtectedRoute />}>
                <Route
                    path="/admin"
                    element={<AdminLayout />}
                >
                    {/* Dashboard */}
                    <Route
                        index
                        element={<AdminDashboard />}
                    />

                    {/* Workshop management */}
                    <Route
                        path="workshops"
                        element={<WorkshopIndex />}
                    />

                    <Route
                        path="workshops/create"
                        element={<WorkshopForm />}
                    />

                    <Route
                        path="workshops/:id/edit"
                        element={<WorkshopForm />}
                    />
                    <Route
                        path="workshops/:id"
                        element={
                            <WorkshopShow />
                        }
                    />

                    <Route
                        path="/admin/workshops/:id"
                        element={
                            <WorkshopShow />
                        }
                    />

                    {/* Registration management */}
                    <Route
                        path="registrations"
                        element={<RegistrationIndex />}
                    />

                    {/* Trainer management */}
                    <Route
                        path="trainers"
                        element={<TrainerIndex />}
                    />

                    <Route
                        path="trainers/create"
                        element={<TrainerForm />}
                    />

                    <Route
                        path="trainers/:id/edit"
                        element={<TrainerForm />}
                    />

                    {/* FAQ management */}
                    <Route
                        path="faqs"
                        element={
                            <PlaceholderPage
                                title="FAQ Management"
                                description="Create, edit, delete and organize frequently asked questions."
                            />
                        }
                    />

                    {/* Attendance management */}
                    <Route
                        path="attendance"
                        element={
                            <PlaceholderPage
                                title="Attendance"
                                description="Mark participant attendance, absences and no-shows."
                            />
                        }
                    />

                    {/* SMS log management */}
                    <Route
                        path="sms-logs"
                        element={
                            <PlaceholderPage
                                title="SMS Logs"
                                description="View confirmation SMS delivery status, provider responses and failure reasons."
                            />
                        }
                    />

                    {/* Site settings */}
                    <Route
                        path="settings"
                        element={
                            <PlaceholderPage
                                title="Site Settings"
                                description="Manage public website content, contact details, social links and community URLs."
                            />
                        }
                    />

                    {/* Invalid admin route */}
                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/admin"
                                replace
                            />
                        }
                    />
                </Route>
            </Route>

            {/* Invalid public route */}
            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />
        </Routes>
    );
}
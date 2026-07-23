import {
    Navigate,
    Route,
    Routes,
} from 'react-router-dom';

import AdminLayout from './Layouts/AdminLayout';
import AdminProtectedRoute from './Routes/AdminProtectedRoute';

import Home from './Pages/Home';

import AdminLogin from './Pages/Admin/Login';
import PlaceholderPage from './Pages/Admin/PlaceholderPage';

import WorkshopIndex from './Pages/Admin/Workshops/Index';
import WorkshopForm from './Pages/Admin/Workshops/Form';
import WorkshopShow from './Pages/Admin/Workshops/Show';

import RegistrationIndex from './Pages/Admin/Registrations/Index';

import TrainerIndex from './Pages/Admin/Trainers/Index';
import TrainerForm from './Pages/Admin/Trainers/Form';

import AdminDashboard from './Pages/Admin/Dashboard/Index';

export default function AppRouter() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/admin/login"
                element={<AdminLogin />}
            />

            <Route element={<AdminProtectedRoute />}>
                <Route
                    path="/admin"
                    element={<AdminLayout />}
                >
                    <Route
                        index
                        element={
                            <Navigate
                                to="dashboard"
                                replace
                            />
                        }
                    />

                    <Route
                        path="dashboard"
                        element={<AdminDashboard />}
                    />

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
                        element={<WorkshopShow />}
                    />

                    <Route
                        path="registrations"
                        element={<RegistrationIndex />}
                    />

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

                    <Route
                        path="faqs"
                        element={
                            <PlaceholderPage
                                title="FAQ Management"
                                description="Create, edit, delete and organize frequently asked questions."
                            />
                        }
                    />

                    <Route
                        path="attendance"
                        element={
                            <PlaceholderPage
                                title="Attendance"
                                description="Mark participant attendance, absences and no-shows."
                            />
                        }
                    />

                    <Route
                        path="sms-logs"
                        element={
                            <PlaceholderPage
                                title="SMS Logs"
                                description="View confirmation SMS delivery status, provider responses and failure reasons."
                            />
                        }
                    />

                    <Route
                        path="settings"
                        element={
                            <PlaceholderPage
                                title="Site Settings"
                                description="Manage public website content, contact details, social links and community URLs."
                            />
                        }
                    />

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="dashboard"
                                replace
                            />
                        }
                    />
                </Route>
            </Route>

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
import {
    CalendarDays,
    CheckSquare,
    CircleHelp,
    LayoutDashboard,
    MessageSquareText,
    Settings,
    UserRoundCog,
    Users,
} from 'lucide-react';

import { NavLink } from 'react-router-dom';

const navigation = [
    {
        label: 'Dashboard',
        to: '/admin',
        icon: LayoutDashboard,
        end: true,
    },
    {
        label: 'Workshops',
        to: '/admin/workshops',
        icon: CalendarDays,
    },
    {
        label: 'Registrations',
        to: '/admin/registrations',
        icon: Users,
    },
    {
        label: 'Trainers',
        to: '/admin/trainers',
        icon: UserRoundCog,
    },
    {
        label: 'FAQs',
        to: '/admin/faqs',
        icon: CircleHelp,
    },
    {
        label: 'Attendance',
        to: '/admin/attendance',
        icon: CheckSquare,
    },
    {
        label: 'SMS Logs',
        to: '/admin/sms-logs',
        icon: MessageSquareText,
    },
    {
        label: 'Settings',
        to: '/admin/settings',
        icon: Settings,
    },
];

export default function AdminSidebar() {
    return (
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-[#071F42] text-white lg:flex">
            <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#F5B400] font-black text-[#071F42]">
                    EQ
                </div>

                <div>
                    <p className="font-black">
                        Workshop Admin
                    </p>

                    <p className="text-xs text-slate-400">
                        Equest Institute
                    </p>
                </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                {navigation.map(
                    ({
                        label,
                        to,
                        icon: Icon,
                        end,
                    }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({
                                isActive,
                            }) =>
                                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                                    isActive
                                        ? 'bg-[#F5B400] text-[#071F42]'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            <Icon className="h-5 w-5" />

                            {label}
                        </NavLink>
                    ),
                )}
            </nav>
        </aside>
    );
}
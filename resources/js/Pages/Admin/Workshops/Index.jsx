import {
   Archive,
    Copy,
    Edit3,
    Eye,
    ImageIcon,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';

import {
    useEffect,
    useState,
} from 'react';

import { Link } from 'react-router-dom';
import api from '../../../services/api';

const statusLabels = {
    draft: 'Draft',
    registration_open: 'Registration Open',
    full: 'Full',
    registration_closed: 'Registration Closed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    archived: 'Archived',
};

const statusClasses = {
    draft: 'bg-slate-100 text-slate-700',
    registration_open:
        'bg-emerald-100 text-emerald-700',
    full: 'bg-orange-100 text-orange-700',
    registration_closed:
        'bg-amber-100 text-amber-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
    archived: 'bg-purple-100 text-purple-700',
};

export default function WorkshopIndex() {
    const [workshops, setWorkshops] = useState([]);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);

    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        document.title = 'Workshop Management';
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            setLoading(true);
            setError('');

            try {
                const response = await api.get(
                    '/admin/workshops',
                    {
                        params: {
                            search:
                                search || undefined,
                            status:
                                status || undefined,
                            page,
                        },
                    },
                );

                setWorkshops(
                    response.data.data || [],
                );

                setMeta(response.data.meta);
            } catch (requestError) {
                setError(
                    requestError.response?.data
                        ?.message ||
                        'Unable to load workshops.',
                );
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [
        search,
        status,
        page,
        refreshKey,
    ]);

    const refresh = () => {
        setRefreshKey((value) => value + 1);
    };

    const duplicateWorkshop = async (id) => {
        try {
            await api.post(
                `/admin/workshops/${id}/duplicate`,
            );

            refresh();
        } catch (requestError) {
            alert(
                requestError.response?.data
                    ?.message ||
                    'Unable to duplicate workshop.',
            );
        }
    };

    const archiveWorkshop = async (id) => {
        const confirmed = window.confirm(
            'Archive this workshop?',
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.post(
                `/admin/workshops/${id}/archive`,
            );

            refresh();
        } catch (requestError) {
            alert(
                requestError.response?.data
                    ?.message ||
                    'Unable to archive workshop.',
            );
        }
    };

    const deleteWorkshop = async (id) => {
        const confirmed = window.confirm(
            'Permanently delete this workshop?',
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(
                `/admin/workshops/${id}`,
            );

            refresh();
        } catch (requestError) {
            alert(
                requestError.response?.data
                    ?.message ||
                    'Unable to delete workshop.',
            );
        }
    };

    return (
        <section>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
                        Event Management
                    </p>

                    <h2 className="mt-2 text-3xl font-black text-[#071F42]">
                        Workshops
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Create and manage workshop
                        events and registration
                        availability.
                    </p>
                </div>

                <Link
                    to="/admin/workshops/create"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5B400] px-5 py-3 font-black text-[#071F42] transition hover:bg-amber-300"
                >
                    <Plus className="h-5 w-5" />

                    Add Workshop
                </Link>
              
            </div>

            <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_240px]">
                <label className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) => {
                            setSearch(
                                event.target.value,
                            );

                            setPage(1);
                        }}
                        placeholder="Search title, city or venue..."
                        className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none focus:border-[#0B2C5D] focus:ring-4 focus:ring-blue-100"
                    />
                </label>

                <select
                    value={status}
                    onChange={(event) => {
                        setStatus(
                            event.target.value,
                        );

                        setPage(1);
                    }}
                    className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0B2C5D] focus:ring-4 focus:ring-blue-100"
                >
                    <option value="">
                        All Statuses
                    </option>

                    {Object.entries(
                        statusLabels,
                    ).map(([value, label]) => (
                        <option
                            key={value}
                            value={value}
                        >
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            )}

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {loading ? (
                    <div className="py-20 text-center text-slate-500">
                        Loading workshops...
                    </div>
                ) : workshops.length === 0 ? (
                    <div className="py-20 text-center">
                        <CalendarEmptyState />

                        <p className="mt-4 font-bold text-slate-700">
                            No workshops found.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1050px]">
                            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">
                                        Workshop
                                    </th>

                                    <th className="px-6 py-4">
                                        Date
                                    </th>

                                  
                                    <th className="px-6 py-4">
                                        Capacity
                                    </th>

                                    <th className="px-6 py-4">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {workshops.map(
                                    (workshop) => (
                                        <tr
                                            key={
                                                workshop.id
                                            }
                                            className="border-t border-slate-100"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                                        {workshop.banner_url ? (
                                                            <img
                                                                src={
                                                                    workshop.banner_url
                                                                }
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="grid h-full place-items-center">
                                                                <ImageIcon className="h-6 w-6 text-slate-400" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <p className="font-black text-[#071F42]">
                                                            {
                                                                workshop.title
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            {
                                                                workshop.presenter
                                                            }
                                                        </p>

                                                        {workshop.is_featured && (
                                                            <span className="mt-2 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-700">
                                                                Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                <p className="font-bold">
                                                    {
                                                        workshop.workshop_date
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs">
                                                    {
                                                        workshop.start_time
                                                    }
                                                    {' - '}
                                                    {
                                                        workshop.end_time
                                                    }
                                                </p>
                                            </td>

                                         
                                          

                                            <td className="px-6 py-4 font-bold text-slate-700">
                                                {
                                                    workshop.capacity
                                                }
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ${statusClasses[workshop.status]}`}
                                                >
                                                    {
                                                        statusLabels[
                                                            workshop
                                                                .status
                                                        ]
                                                    }
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                              
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            to={`/admin/workshops/${workshop.id}`}
                                                            className="grid h-9 w-9 place-items-center rounded-lg bg-purple-50 text-purple-600 transition hover:bg-purple-600 hover:text-white"
                                                            title="View Workshop"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>

                                                        <Link
                                                            to={`/admin/workshops/${workshop.id}/edit`}
                                                            className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                                                            title="Edit"
                                                        >
                                                            <Edit3 className="h-4 w-4" />
                                                        </Link>

                                                       
                                                

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            duplicateWorkshop(
                                                                workshop.id,
                                                            )
                                                        }
                                                        className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                                                        title="Duplicate"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            archiveWorkshop(
                                                                workshop.id,
                                                            )
                                                        }
                                                        className="grid h-9 w-9 place-items-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white"
                                                        title="Archive"
                                                    >
                                                        <Archive className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteWorkshop(
                                                                workshop.id,
                                                            )
                                                        }
                                                        className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                    <p className="text-sm text-slate-500">
                        Total: {meta.total}
                    </p>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={
                                meta.current_page <= 1
                            }
                            onClick={() =>
                                setPage(
                                    (current) =>
                                        current - 1,
                                )
                            }
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            disabled={
                                meta.current_page >=
                                meta.last_page
                            }
                            onClick={() =>
                                setPage(
                                    (current) =>
                                        current + 1,
                                )
                            }
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

function CalendarEmptyState() {
    return (
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100">
            <ImageIcon className="h-7 w-7 text-slate-400" />
        </div>
    );
}
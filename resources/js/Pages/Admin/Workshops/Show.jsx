import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    Edit3,
    ExternalLink,
    ImageIcon,
    MapPin,
    MessageCircle,
    UserRound,
    Users,
} from 'lucide-react';

import {
    useEffect,
    useState,
} from 'react';

import {
    Link,
    useParams,
} from 'react-router-dom';

import api from '../../../services/api';

const statusLabels = {
    draft: 'Draft',
    registration_open:
        'Registration Open',
    full: 'Full',
    registration_closed:
        'Registration Closed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    archived: 'Archived',
};

const statusClasses = {
    draft:
        'bg-slate-100 text-slate-700',

    registration_open:
        'bg-emerald-100 text-emerald-700',

    full:
        'bg-orange-100 text-orange-700',

    registration_closed:
        'bg-amber-100 text-amber-700',

    completed:
        'bg-blue-100 text-blue-700',

    cancelled:
        'bg-red-100 text-red-700',

    archived:
        'bg-purple-100 text-purple-700',
};

export default function WorkshopShow() {
    const { id } = useParams();

    const [workshop, setWorkshop] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    useEffect(() => {
        const controller =
            new AbortController();

        const loadWorkshop = async () => {
            setLoading(true);
            setError('');

            try {
                const response =
                    await api.get(
                        `/admin/workshops/${id}`,
                        {
                            signal:
                                controller.signal,
                        },
                    );

                setWorkshop(
                    response.data.data,
                );

                document.title =
                    response.data.data
                        ?.title ||
                    'Workshop Details';
            } catch (requestError) {
                if (
                    requestError.code ===
                    'ERR_CANCELED'
                ) {
                    return;
                }

                setError(
                    requestError.response
                        ?.data?.message ||
                        'Unable to load workshop details.',
                );
            } finally {
                setLoading(false);
            }
        };

        loadWorkshop();

        return () => {
            controller.abort();
        };
    }, [id]);

    if (loading) {
        return (
            <div className="py-24 text-center text-slate-500">
                Loading workshop details...
            </div>
        );
    }

    if (
        error ||
        !workshop
    ) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                {error ||
                    'Workshop not found.'}
            </div>
        );
    }

    return (
        <section>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                    <Link
                        to="/admin/workshops"
                        className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-[#071F42] transition hover:border-amber-400"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>

                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
                            Workshop Details
                        </p>

                        <h1 className="mt-1 text-3xl font-black text-[#071F42]">
                            {workshop.title}
                        </h1>
                    </div>
                </div>

                <Link
                    to={`/admin/workshops/${workshop.id}/edit`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5B400] px-5 py-3 font-black text-[#071F42] transition hover:bg-amber-300"
                >
                    <Edit3 className="h-5 w-5" />

                    Edit Workshop
                </Link>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {workshop.banner_url ? (
                    <img
                        src={
                            workshop.banner_url
                        }
                        alt={
                            workshop.title
                        }
                        className="max-h-[420px] w-full object-cover"
                    />
                ) : (
                    <div className="grid h-64 place-items-center bg-slate-100">
                        <ImageIcon className="h-12 w-12 text-slate-400" />
                    </div>
                )}

                <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-3">
                        <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ${
                                statusClasses[
                                    workshop.status
                                ] ||
                                statusClasses.draft
                            }`}
                        >
                            {statusLabels[
                                workshop.status
                            ] ||
                                workshop.status}
                        </span>

                        {workshop.is_featured && (
                            <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-black text-amber-700">
                                Featured
                            </span>
                        )}
                    </div>

                    {workshop.description && (
                        <p className="mt-5 whitespace-pre-line leading-7 text-slate-600">
                            {
                                workshop.description
                            }
                        </p>
                    )}

                    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <SummaryCard
                            icon={
                                CalendarDays
                            }
                            label="Workshop Date"
                            value={
                                workshop.workshop_date
                            }
                        />

                        <SummaryCard
                            icon={Clock3}
                            label="Workshop Time"
                            value={`${workshop.start_time} - ${workshop.end_time}`}
                        />

                        <SummaryCard
                            icon={MapPin}
                            label="Locations"
                            value={
                                workshop.location_count
                            }
                        />

                        <SummaryCard
                            icon={Users}
                            label="Total Capacity"
                            value={
                                workshop.total_capacity
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-black text-[#071F42]">
                    Locations and Trainers
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Each location runs on the
                    same workshop date and
                    time.
                </p>

                <div className="mt-6 grid gap-6 xl:grid-cols-2">
                    {workshop.locations.map(
                        (
                            location,
                            index,
                        ) => (
                            <LocationCard
                                key={
                                    location.id
                                }
                                location={
                                    location
                                }
                                index={
                                    index
                                }
                            />
                        ),
                    )}
                </div>
            </div>
        </section>
    );
}

function LocationCard({
    location,
    index,
}) {
    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-black uppercase tracking-wider text-amber-600">
                    Location {index + 1}
                </p>

                <h3 className="mt-1 text-xl font-black text-[#071F42]">
                    {location.city}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    {location.venue},{' '}
                    {location.district}
                </p>
            </div>

            <div className="p-5">
                <div className="grid grid-cols-3 gap-3">
                    <SmallStat
                        label="Capacity"
                        value={
                            location.capacity
                        }
                    />

                    <SmallStat
                        label="Registered"
                        value={
                            location.registered_count
                        }
                    />

                    <SmallStat
                        label="Available"
                        value={
                            location.available_seats
                        }
                    />
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    {location.map_url && (
                        <a
                            href={
                                location.map_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-[#071F42] transition hover:bg-slate-50"
                        >
                            <ExternalLink className="h-4 w-4" />

                            Open Map
                        </a>
                    )}

                    {location.whatsapp_group_url && (
                        <a
                            href={
                                location.whatsapp_group_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700"
                        >
                            <MessageCircle className="h-4 w-4" />

                            WhatsApp Group
                        </a>
                    )}
                </div>

                <div className="mt-6 border-t border-slate-200 pt-5">
                    <h4 className="font-black text-[#071F42]">
                        Assigned Trainers
                    </h4>

                    <div className="mt-4 space-y-3">
                        {location.trainers
                            ?.length > 0 ? (
                            location.trainers.map(
                                (
                                    trainer,
                                ) => (
                                    <TrainerCard
                                        key={
                                            trainer.id
                                        }
                                        trainer={
                                            trainer
                                        }
                                    />
                                ),
                            )
                        ) : (
                            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                                No trainers
                                assigned.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}

function TrainerCard({
    trainer,
}) {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
            {trainer.photo_url ? (
                <img
                    src={
                        trainer.photo_url
                    }
                    alt={
                        trainer.name
                    }
                    className="h-14 w-14 rounded-xl object-cover"
                />
            ) : (
                <div className="grid h-14 w-14 place-items-center rounded-xl bg-slate-100 text-slate-400">
                    <UserRound className="h-6 w-6" />
                </div>
            )}

            <div>
                <p className="font-black text-[#071F42]">
                    {trainer.name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                    {trainer.role}
                </p>
            </div>
        </div>
    );
}

function SummaryCard({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="rounded-xl bg-slate-50 p-4">
            <Icon className="h-5 w-5 text-amber-600" />

            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                {label}
            </p>

            <p className="mt-1 font-black text-[#071F42]">
                {value ?? '—'}
            </p>
        </div>
    );
}

function SmallStat({
    label,
    value,
}) {
    return (
        <div className="rounded-xl bg-slate-50 p-3 text-center">
            <p className="text-xs font-semibold text-slate-500">
                {label}
            </p>

            <p className="mt-1 text-lg font-black text-[#071F42]">
                {value ?? 0}
            </p>
        </div>
    );
}
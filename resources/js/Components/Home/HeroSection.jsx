const workshop = {
    title: 'Crypto Trading Free Workshop',
    presenter: 'Dinisu Indrachapa',
    date: 'July 18, 2026',
    day: 'Saturday',
    startTime: '9:00 AM',
    endTime: '1:00 PM',
    venue: 'Equest Campus, Kurunegala',
    city: 'Kurunegala, Sri Lanka',
    capacity: 120,
    registered: 83,
    status: 'Registration Open',
    mapUrl: 'https://maps.google.com',
};

function CalendarIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 2v3M16 2v3M3 9h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z"
            />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="9" />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 7v5l3 2"
            />
        </svg>
    );
}

function LocationIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
            />

            <circle cx="12" cy="10" r="2.5" />
        </svg>
    );
}

function BuildingIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6"
            />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <circle cx="9" cy="8" r="3" />
            <circle cx="17" cy="9" r="2.5" />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 20c0-4 2.5-7 6-7s6 3 6 7M15 14c3 0 5 2.5 5 6"
            />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M14 7l5 5-5 5"
            />
        </svg>
    );
}

function EventDetail({ icon, children }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0 text-[#F5B400]">
                {icon}
            </div>

            <p className="text-sm font-semibold leading-6 text-slate-100 sm:text-base">
                {children}
            </p>
        </div>
    );
}

export default function HeroSection() {
    const seatsRemaining = Math.max(
        workshop.capacity - workshop.registered,
        0,
    );

    const registrationPercentage = Math.min(
        Math.round(
            (workshop.registered / workshop.capacity) * 100,
        ),
        100,
    );

    return (
        <section
            id="workshop"
            className="relative scroll-mt-28 overflow-hidden bg-[#061D42] text-white"
        >
            {/* Background image */}
            <img
                src="/images/workshop-hero.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center opacity-35"
                onError={(event) => {
                    event.currentTarget.style.display = 'none';
                }}
            />

            {/* Dark blue overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#061D42] via-[#061D42]/95 to-[#061D42]/60" />

            <div className="absolute inset-0 bg-gradient-to-t from-[#061D42] via-transparent to-[#061D42]/30" />

            {/* Decorative glow */}
            <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#F5B400]/15 blur-3xl" />

            <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
                {/* Left content */}
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F5B400]">
                        Free Practical Workshop
                    </p>

                    <h1 className="mt-5 max-w-3xl text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                        Crypto Trading

                        <span className="mt-2 block text-[#F5B400]">
                            Free Workshop
                        </span>
                    </h1>

                    <p className="mt-5 text-2xl font-medium italic text-white sm:text-3xl">
                        by {workshop.presenter}
                    </p>

                    <p className="mt-4 text-sm font-semibold text-slate-200 sm:text-base">
                        Powered by{' '}

                        <span className="font-black text-[#F5B400]">
                            Equest Institute of Higher Education
                        </span>
                    </p>

                    <div className="mt-8 grid max-w-xl gap-3">
                        <EventDetail icon={<CalendarIcon />}>
                            {workshop.date} ({workshop.day})
                        </EventDetail>

                        <EventDetail icon={<ClockIcon />}>
                            {workshop.startTime} – {workshop.endTime}
                        </EventDetail>

                        <EventDetail icon={<LocationIcon />}>
                            {workshop.venue}
                        </EventDetail>

                        <EventDetail icon={<BuildingIcon />}>
                            {workshop.city}
                        </EventDetail>
                    </div>

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <a
                            href="#register"
                            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-lg bg-[#F5B400] px-7 py-4 text-sm font-black uppercase tracking-wide text-[#061D42] shadow-[0_10px_30px_rgba(245,180,0,0.25)] transition hover:-translate-y-0.5 hover:bg-[#ffca27]"
                        >
                            Reserve Your Seat

                            <ArrowIcon />
                        </a>

                        <a
                            href={workshop.mapUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-lg border border-white/45 bg-[#061D42]/40 px-7 py-4 text-sm font-black uppercase tracking-wide text-white backdrop-blur transition hover:border-[#F5B400] hover:text-[#F5B400]"
                        >
                            <LocationIcon />

                            View Location
                        </a>
                    </div>
                </div>

                {/* Seat availability card */}
                <div className="mx-auto w-full max-w-md lg:ml-auto">
                    <div className="rounded-3xl border border-white/20 bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
                        <div className="text-center">
                            <span className="inline-flex rounded-lg bg-[#0B2C5D] px-5 py-2 text-xs font-black uppercase tracking-wide text-white">
                                Live Update
                            </span>

                            <p className="mt-5 text-sm font-bold text-slate-600">
                                Seats Remaining
                            </p>

                            <div className="mt-1 flex items-end justify-center gap-3">
                                <span className="text-6xl font-black text-[#F5B400] sm:text-7xl">
                                    {seatsRemaining}
                                </span>

                                <span className="pb-2 text-3xl font-black text-[#0B2C5D]">
                                    / {workshop.capacity}
                                </span>
                            </div>

                            <span className="mt-5 inline-flex rounded-md bg-emerald-500 px-6 py-2 text-sm font-black uppercase text-white">
                                {workshop.status}
                            </span>
                        </div>

                        <div className="my-7 h-px bg-slate-200" />

                        <div>
                            <div className="flex items-center justify-between text-sm font-bold">
                                <span className="text-slate-600">
                                    Capacity Progress
                                </span>

                                <span className="text-[#0B2C5D]">
                                    {registrationPercentage}%
                                </span>
                            </div>

                            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                                <div
                                    className="h-full rounded-full bg-[#F5B400] transition-all duration-500"
                                    style={{
                                        width: `${registrationPercentage}%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="mt-7 flex flex-col gap-3 border-t border-slate-200 pt-5 text-sm font-bold text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <UsersIcon />

                                <span>
                                    {workshop.capacity} Seats Available
                                </span>
                            </div>

                            <span className="text-red-600">
                                Limited Seats Only!
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
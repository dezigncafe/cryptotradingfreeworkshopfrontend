const metrics = [
    {
        value: '25,000+',
        label: 'Students Trained',
        icon: GraduationIcon,
    },
    {
        value: '180+',
        label: 'Workshops Conducted',
        icon: PresentationIcon,
    },
    {
        value: '6+',
        label: 'Years of Experience',
        icon: AwardIcon,
    },
    {
        value: '20,000+',
        label: 'Community Members',
        icon: UsersIcon,
    },
];

export default function MetricsSection() {
    return (
        <section className="bg-white px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <h2 className="text-2xl font-black uppercase text-[#071F42]">
                    Why Learn With Us
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {metrics.map(({ value, label, icon: Icon }) => (
                        <article
                            key={label}
                            className="flex min-h-[105px] items-center gap-5 rounded-xl bg-[#062C73] px-6 py-5 text-white shadow-lg"
                        >
                            <div className="shrink-0 text-[#F5B400]">
                                <Icon />
                            </div>

                            <div>
                                <p className="text-2xl font-black">
                                    {value}
                                </p>

                                <p className="mt-1 text-xs font-bold text-slate-200">
                                    {label}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function GraduationIcon() {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="h-12 w-12"
        >
            <path d="M4 17 24 7l20 10-20 10L4 17Z" />
            <path d="M12 22v12c7 6 17 6 24 0V22" />
            <path d="M44 17v18" />
        </svg>
    );
}

function PresentationIcon() {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="h-12 w-12"
        >
            <rect x="5" y="6" width="38" height="27" rx="2" />
            <path d="M24 33v9M15 42h18" />
            <circle cx="16" cy="17" r="4" />
            <path d="M10 29c1-6 3-9 6-9s5 3 6 9" />
            <path d="M29 15h9M29 21h9M29 27h6" />
        </svg>
    );
}

function AwardIcon() {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="h-12 w-12"
        >
            <circle cx="24" cy="18" r="13" />
            <path d="m24 10 2.5 5 5.5.8-4 4 1 5.5-5-2.7-5 2.7 1-5.5-4-4 5.5-.8 2.5-5Z" />
            <path d="m16 29-3 15 11-6 11 6-3-15" />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="h-12 w-12"
        >
            <circle cx="24" cy="14" r="7" />
            <circle cx="10" cy="18" r="5" />
            <circle cx="38" cy="18" r="5" />
            <path d="M12 43c1-10 5-15 12-15s11 5 12 15" />
            <path d="M2 41c1-7 4-11 9-11 3 0 5 1 7 3" />
            <path d="M46 41c-1-7-4-11-9-11-3 0-5 1-7 3" />
        </svg>
    );
}
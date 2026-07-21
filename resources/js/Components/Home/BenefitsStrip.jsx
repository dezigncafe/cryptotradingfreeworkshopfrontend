const benefits = [
    {
        title: '100%',
        subtitle: 'Free Admission',
        icon: GiftIcon,
        accent: 'text-[#F5B400]',
    },
    {
        title: 'Beginner',
        subtitle: 'Friendly',
        icon: UserIcon,
        accent: 'text-[#0B2C5D]',
    },
    {
        title: 'Practical',
        subtitle: 'Training',
        icon: GraduationIcon,
        accent: 'text-[#0B2C5D]',
    },
    {
        title: 'Binance Setup',
        subtitle: 'Guidance',
        icon: BinanceIcon,
        accent: 'text-[#F5B400]',
    },
    {
        title: 'Community',
        subtitle: 'Access',
        icon: CommunityIcon,
        accent: 'text-[#0B2C5D]',
    },
];

export default function BenefitsStrip() {
    return (
        <section className="relative z-20 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto -mt-6 max-w-7xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.18)]">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {benefits.map(
                        (
                            {
                                title,
                                subtitle,
                                icon: Icon,
                                accent,
                            },
                            index,
                        ) => (
                            <article
                                key={`${title}-${subtitle}`}
                                className={`
                                    relative flex min-h-[105px]
                                    items-center justify-center gap-4
                                    px-5 py-5

                                    ${
                                        index !== benefits.length - 1
                                            ? 'lg:after:absolute lg:after:right-0 lg:after:top-1/2 lg:after:h-14 lg:after:w-px lg:after:-translate-y-1/2 lg:after:bg-slate-300'
                                            : ''
                                    }
                                `}
                            >
                                <div className={`shrink-0 ${accent}`}>
                                    <Icon />
                                </div>

                                <div>
                                    <h3 className="text-sm font-black leading-tight text-[#071F42] sm:text-base">
                                        {title}
                                    </h3>

                                    <p className="mt-1 text-xs font-bold leading-tight text-[#071F42] sm:text-sm">
                                        {subtitle}
                                    </p>
                                </div>
                            </article>
                        ),
                    )}
                </div>
            </div>
        </section>
    );
}

function GiftIcon() {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="h-11 w-11"
            aria-hidden="true"
        >
            <rect
                x="6"
                y="18"
                width="36"
                height="25"
                rx="2"
            />

            <path d="M4 18h40v-8H4v8Z" />
            <path d="M24 10v33" />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M24 10c-6 0-10-2-10-6 0-3 2-4 4-4 4 0 6 6 6 10Z"
            />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M24 10c6 0 10-2 10-6 0-3-2-4-4-4-4 0-6 6-6 10Z"
            />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="h-11 w-11"
            aria-hidden="true"
        >
            <circle cx="24" cy="14" r="8" />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 42c1-10 7-15 15-15s14 5 15 15H9Z"
            />
        </svg>
    );
}

function GraduationIcon() {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="h-11 w-11"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 17 24 7l20 10-20 10L4 17Z"
            />

            <path d="M12 21v12c7 6 17 6 24 0V21" />
            <path d="M44 17v15" />
        </svg>
    );
}

function BinanceIcon() {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="currentColor"
            className="h-11 w-11"
            aria-hidden="true"
        >
            <path d="M24 3 33 12 24 21 15 12 24 3Z" />
            <path d="M10 17 17 24 10 31 3 24 10 17Z" />
            <path d="M38 17 45 24 38 31 31 24 38 17Z" />
            <path d="M24 27 33 36 24 45 15 36 24 27Z" />
            <path d="M24 15 33 24 24 33 15 24 24 15Z" />
        </svg>
    );
}

function CommunityIcon() {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="h-12 w-12"
            aria-hidden="true"
        >
            <circle cx="24" cy="13" r="7" />
            <circle cx="10" cy="17" r="5" />
            <circle cx="38" cy="17" r="5" />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 42c1-10 5-15 12-15s11 5 12 15"
            />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2 40c1-7 4-11 9-11 3 0 5 1 7 3"
            />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M46 40c-1-7-4-11-9-11-3 0-5 1-7 3"
            />
        </svg>
    );
}
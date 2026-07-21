const learningItems = [
    {
        number: 1,
        title: 'Cryptocurrency Basics',
        type: 'crypto',
    },
    {
        number: 2,
        title: 'Binance Account Creation',
        type: 'account',
    },
    {
        number: 3,
        title: 'Spot Trading Essentials',
        type: 'bars',
    },
    {
        number: 4,
        title: 'Futures Trading Fundamentals',
        type: 'chart',
    },
    {
        number: 5,
        title: 'Entry, Target & Stop-Loss Placement',
        type: 'target',
    },
    {
        number: 6,
        title: 'Risk Management Principles',
        type: 'shield',
    },
    {
        number: 7,
        title: 'Common Beginner Mistakes',
        type: 'mistake',
    },
    {
        number: 8,
        title: 'Trading Psychology',
        type: 'brain',
    },
    {
        number: 9,
        title: 'Live Practical Demonstration',
        type: 'video',
    },
    {
        number: 10,
        title: 'Q&A Session',
        type: 'question',
    },
];

export default function LearnSection() {
    return (
        <section
            id="learn"
            className="scroll-mt-28 bg-white px-4 py-8 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-7xl">
                <h2 className="text-2xl font-black uppercase tracking-tight text-[#071F42] sm:text-3xl">
                    What You Will Learn
                </h2>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {learningItems.map((item) => (
                        <article
                            key={item.number}
                            className="group flex min-h-[150px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-5 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#F5B400] hover:shadow-lg"
                        >
                            <div className="text-[#0B2C5D] transition group-hover:text-[#F5B400]">
                                <LearningIcon type={item.type} />
                            </div>

                            <h3 className="mt-4 max-w-[170px] text-xs font-black leading-5 text-[#071F42] sm:text-sm">
                                {item.number}. {item.title}
                            </h3>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function LearningIcon({ type }) {
    const commonProps = {
        viewBox: '0 0 48 48',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2.5,
        className: 'h-12 w-12',
        'aria-hidden': true,
    };

    if (type === 'crypto') {
        return (
            <svg {...commonProps}>
                <circle cx="24" cy="24" r="17" />
                <path d="M19 14v20M27 14v20" />
                <path d="M16 18h12c4 0 6 2 6 5s-2 5-6 5H16" />
                <path d="M16 28h13c4 0 6 2 6 5" />
                <path d="M14 8v5M22 7v5M30 8v5" />
            </svg>
        );
    }

    if (type === 'account') {
        return (
            <svg {...commonProps}>
                <circle cx="20" cy="15" r="7" />
                <path d="M7 39c1-10 6-15 13-15s12 5 13 15H7Z" />
                <path d="M37 20v14M30 27h14" />
            </svg>
        );
    }

    if (type === 'bars') {
        return (
            <svg {...commonProps}>
                <path d="M6 41h36" />
                <rect x="9" y="27" width="6" height="14" />
                <rect x="21" y="20" width="6" height="21" />
                <rect x="33" y="12" width="6" height="29" />
                <path d="m8 23 11-8 8 3L40 7" />
                <path d="M34 7h6v6" />
            </svg>
        );
    }

    if (type === 'chart') {
        return (
            <svg {...commonProps}>
                <path d="M6 41h36M8 41V8" />
                <path d="m12 31 9-10 7 5 12-15" />
                <path d="M34 11h6v6" />
            </svg>
        );
    }

    if (type === 'target') {
        return (
            <svg {...commonProps}>
                <circle cx="22" cy="25" r="16" />
                <circle cx="22" cy="25" r="9" />
                <circle cx="22" cy="25" r="3" />
                <path d="m26 21 14-14M34 7h6v6" />
            </svg>
        );
    }

    if (type === 'shield') {
        return (
            <svg {...commonProps}>
                <path d="M24 5 39 11v11c0 10-6 17-15 22C15 39 9 32 9 22V11l15-6Z" />
            </svg>
        );
    }

    if (type === 'mistake') {
        return (
            <svg {...commonProps}>
                <circle cx="24" cy="24" r="17" />
                <path d="m17 17 14 14M31 17 17 31" />
            </svg>
        );
    }

    if (type === 'brain') {
        return (
            <svg {...commonProps}>
                <path d="M19 9c-5 0-8 4-8 8-4 2-5 8-2 12-1 5 3 10 8 10 2 4 9 4 11 0 6 0 9-5 8-10 3-4 2-10-2-12 0-4-3-8-8-8-2-4-7-4-7 0Z" />
                <path d="M19 9v30M19 17c-4 0-6 3-6 6M19 29c-4 0-6 3-6 6M27 17c4 0 6 3 6 6M27 29c4 0 6 3 6 6" />
            </svg>
        );
    }

    if (type === 'video') {
        return (
            <svg {...commonProps}>
                <rect x="6" y="8" width="36" height="27" rx="2" />
                <path d="m20 17 11 5-11 6V17Z" />
                <path d="M17 42h14M24 35v7" />
            </svg>
        );
    }

    return (
        <svg {...commonProps}>
            <path d="M8 7h32v27H25l-8 7v-7H8V7Z" />
            <path d="M20 17c0-3 2-5 5-5 4 0 6 2 6 5 0 5-6 5-6 9" />
            <circle
                cx="25"
                cy="30"
                r="1"
                fill="currentColor"
                stroke="none"
            />
        </svg>
    );
}
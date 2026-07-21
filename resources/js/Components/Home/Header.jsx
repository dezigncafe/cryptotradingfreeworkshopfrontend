import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import AnnouncementBar from './AnnouncementBar';

const navigation = [
    {
        label: 'Workshop',
        href: '#workshop',
    },
    {
        label: 'Learn',
        href: '#learn',
    },
    {
        label: 'Trainers',
        href: '#trainers',
    },
    {
        label: 'FAQ',
        href: '#faq',
    },
];

function MenuIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                d="M4 6h16M4 12h16M4 18h16"
            />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                d="M6 6l12 12M18 6L6 18"
            />
        </svg>
    );
}

function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);

    if (!section) {
        return;
    }

    section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });
}

export default function Header({ workshop }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const handleAnchorClick = (event, href) => {
        event.preventDefault();

        if (location.pathname !== '/') {
            window.location.href = `/${href}`;
            return;
        }

        scrollToSection(href);
        setMenuOpen(false);
    };

    const ctaLabel =
        workshop?.ctaLabel || 'Reserve Your Seat';

    const canRegister =
        workshop?.canRegister ?? true;

    return (
        <>
            <AnnouncementBar workshop={workshop} />

            <header className="sticky top-0 z-50 border-b border-white/10 bg-[#061D42]/95 text-white shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-lg">
                <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link
                        to="/"
                        className="flex shrink-0 items-center"
                        aria-label="Equest homepage"
                    >
                        <img
                            src="/images/equest-logo.png"
                            alt="Equest Institute of Higher Education"
                            className="h-11 w-auto object-contain sm:h-12"
                            onError={(event) => {
                                event.currentTarget.style.display =
                                    'none';

                                event.currentTarget
                                    .nextElementSibling
                                    ?.classList.remove('hidden');
                            }}
                        />

                        <div className="hidden items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-full border border-[#F5B400] text-sm font-black text-[#F5B400]">
                                EQ
                            </div>

                            <div>
                                <p className="font-serif text-xl leading-none">
                                    EQUEST
                                </p>

                                <p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-slate-300">
                                    Institute of Higher Education
                                </p>
                            </div>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-9 lg:flex">
                        {navigation.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={(event) =>
                                    handleAnchorClick(
                                        event,
                                        item.href,
                                    )
                                }
                                className="relative py-2 text-sm font-bold text-slate-100 transition duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#F5B400] after:transition-all hover:text-[#F5B400] hover:after:w-full"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {canRegister && (
                        <div className="hidden lg:block">
                            <a
                                href="#register"
                                onClick={(event) =>
                                    handleAnchorClick(
                                        event,
                                        '#register',
                                    )
                                }
                                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#F5B400] px-6 py-3 text-sm font-black uppercase tracking-wide text-[#071F42] shadow-[0_8px_24px_rgba(245,180,0,0.24)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#ffca27]"
                            >
                                {ctaLabel}
                            </a>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() =>
                            setMenuOpen(
                                (current) => !current,
                            )
                        }
                        className="grid h-11 w-11 place-items-center rounded-lg border border-white/15 bg-white/5 text-white transition hover:border-[#F5B400]/50 hover:text-[#F5B400] lg:hidden"
                        aria-label="Toggle navigation menu"
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? (
                            <CloseIcon />
                        ) : (
                            <MenuIcon />
                        )}
                    </button>
                </div>

                {menuOpen && (
                    <div className="border-t border-white/10 bg-[#061D42] px-4 py-5 shadow-xl lg:hidden">
                        <nav className="mx-auto flex max-w-7xl flex-col">
                            {navigation.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={(event) =>
                                        handleAnchorClick(
                                            event,
                                            item.href,
                                        )
                                    }
                                    className="rounded-lg px-4 py-3.5 text-sm font-bold text-slate-100 transition hover:bg-white/5 hover:text-[#F5B400]"
                                >
                                    {item.label}
                                </a>
                            ))}

                            {canRegister && (
                                <a
                                    href="#register"
                                    onClick={(event) =>
                                        handleAnchorClick(
                                            event,
                                            '#register',
                                        )
                                    }
                                    className="mt-3 flex min-h-12 items-center justify-center rounded-lg bg-[#F5B400] px-5 py-3 text-center text-sm font-black uppercase text-[#071F42]"
                                >
                                    {ctaLabel}
                                </a>
                            )}
                        </nav>
                    </div>
                )}
            </header>
        </>
    );
}
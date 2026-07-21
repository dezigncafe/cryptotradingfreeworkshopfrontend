const socialLinks = [
    { label: 'f', href: '#' },
    { label: '▶', href: '#' },
    { label: 'in', href: '#' },
    { label: '◎', href: '#' },
    { label: '♪', href: '#' },
];

export default function Footer() {
    return (
        <footer className="bg-[#031E4A] px-4 py-10 text-white sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4">
                <div>
                    <img
                        src="/images/equest-logo.png"
                        alt="Equest Institute"
                        className="h-14 w-auto object-contain"
                    />

                    <p className="mt-4 text-xs text-slate-300">
                        Empowering Minds. Building Futures.
                    </p>
                </div>

                <div>
                    <h3 className="text-sm font-black uppercase">
                        Contact Us
                    </h3>

                    <div className="mt-4 space-y-2 text-xs leading-5 text-slate-300">
                        <p>☎ 037 2 222 555</p>
                        <p>✉ info@equest.edu.lk</p>
                        <p>
                            ⌖ Equest Campus,
                            <br />
                            Kurunegala, Sri Lanka
                        </p>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-black uppercase">
                        Follow Us
                    </h3>

                    <div className="mt-4 flex gap-2">
                        {socialLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs font-black transition hover:bg-[#F5B400] hover:text-[#071F42]"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-black uppercase">
                        Quick Links
                    </h3>

                    <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2 text-xs text-slate-300">
                        <a href="#workshop">Workshop</a>
                        <a href="#faq">FAQ</a>
                        <a href="#learn">Learn</a>
                        <a href="#">Terms</a>
                        <a href="#trainers">Trainers</a>
                        <a href="#">Privacy</a>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-9 max-w-7xl border-t border-white/10 pt-5 text-center text-[11px] text-slate-400">
                © 2026 Equest Institute of Higher Education. All rights reserved.
            </div>
        </footer>
    );
}
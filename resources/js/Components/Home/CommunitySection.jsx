const features = [
    'Educational Resources',
    'Market Updates',
    'Discussions',
    'Support & Guidance',
];

export default function CommunitySection() {
    return (
        <section
            id="community"
            className="scroll-mt-28 bg-white px-4 pb-5 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-7xl rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white px-6 py-6 shadow-sm sm:px-8">
                <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-[#062C73] text-2xl font-black text-[#F5B400]">
                            CX
                        </div>

                        <div>
                            <h2 className="text-2xl font-black uppercase text-[#071F42]">
                                CryptoX Free Community
                            </h2>

                            <p className="mt-2 text-sm text-slate-600">
                                After the workshop, you will receive free access
                                to the CryptoX community.
                            </p>

                            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                                {features.map((feature) => (
                                    <div
                                        key={feature}
                                        className="flex items-center gap-2 text-xs font-bold text-[#071F42]"
                                    >
                                        <span className="grid h-5 w-5 place-items-center rounded-full border border-[#0B2C5D] text-[10px]">
                                            ✓
                                        </span>

                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0">
                        <a
                            href="#register"
                            className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#062C73] px-7 py-4 text-center text-sm font-black uppercase leading-5 text-white transition hover:bg-[#0B2C5D]"
                        >
                            Learn Together.
                            <br />
                            Grow Together.
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
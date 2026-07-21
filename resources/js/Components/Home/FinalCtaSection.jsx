export default function FinalCtaSection() {
    return (
        <section className="bg-white px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-xl bg-[#062C73] px-7 py-6 text-white shadow-lg lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-5">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-[#F5B400] text-2xl">
                        📅
                    </div>

                    <div>
                        <h2 className="text-xl font-black uppercase">
                            Limited Seats. Real Knowledge. Practical Training.
                        </h2>

                        <p className="mt-1 text-sm text-slate-200">
                            Join us in Kurunegala and start your crypto learning
                            journey today.
                        </p>
                    </div>
                </div>

                <a
                    href="#register"
                    className="inline-flex min-h-13 shrink-0 items-center justify-center rounded-lg bg-[#F5B400] px-8 py-4 text-sm font-black uppercase text-[#071F42] transition hover:bg-amber-300"
                >
                    Reserve Your Seat Now →
                </a>
            </div>
        </section>
    );
}
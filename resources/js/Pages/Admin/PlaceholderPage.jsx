export default function PlaceholderPage({
    title,
    description,
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
                Admin Management
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#071F42]">
                {title}
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                {description}
            </p>

            <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                This management module will be created in the next phase.
            </div>
        </section>
    );
}
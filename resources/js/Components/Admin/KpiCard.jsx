export default function KpiCard({
    title,
    value,
    icon: Icon,
    description,
}) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-bold text-slate-500">
                        {title}
                    </p>

                    <p className="mt-3 text-4xl font-black text-[#071F42]">
                        {value}
                    </p>
                </div>

                <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-100 text-amber-600">
                    <Icon className="h-6 w-6" />
                </div>
            </div>

            {description && (
                <p className="mt-4 text-xs text-slate-500">
                    {description}
                </p>
            )}
        </article>
    );
}
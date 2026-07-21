import {
    LogOut,
    UserCircle,
} from 'lucide-react';

export default function AdminTopbar({
    user,
    onLogout,
}) {
    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm sm:px-8">
            <div>
                <p className="text-sm text-slate-500">
                    Administration
                </p>

                <h1 className="font-black text-[#071F42]">
                    Crypto Trading Workshop
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden text-right sm:block">
                    <p className="text-sm font-bold text-slate-800">
                        {user?.name ||
                            'Administrator'}
                    </p>

                    <p className="text-xs text-slate-500">
                        {user?.email}
                    </p>
                </div>

                <UserCircle className="h-9 w-9 text-[#0B2C5D]" />

                <button
                    type="button"
                    onClick={onLogout}
                    className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
                    aria-label="Logout"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
}
import { Head } from '@inertiajs/react';

export default function Home() {
    return (
        <>
            <Head title="Home" />

            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="max-w-md p-6 bg-white rounded-lg shadow">
                    <h1 className="text-2xl font-bold mb-2">Home — Tailwind test</h1>
                    <p className="text-gray-600">If you see styled text, Tailwind is working.</p>
                </div>
            </div>
        </>
    );
}

import {
    ArrowLeft,
    Save,
    Upload,
} from 'lucide-react';

import {
    useEffect,
    useState,
} from 'react';

import {
    Link,
    useNavigate,
    useParams,
} from 'react-router-dom';

import api from '../../../services/api';

const initialForm = {
    title: '',
    presenter: 'Dinisu Indrachapa',
    description: '',
    district: '',
    city: '',
    venue: '',
    map_url: '',
    workshop_date: '',
    start_time: '',
    end_time: '',
    arrival_time: '',
    capacity: 100,
    registration_open_at: '',
    registration_close_at: '',
    status: 'draft',
    whatsapp_group_url: '',
    is_featured: false,
};

const inputClass =
    'mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0B2C5D] focus:ring-4 focus:ring-blue-100';

export default function WorkshopForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEditing = Boolean(id);

    const [form, setForm] =
        useState(initialForm);

    const [banner, setBanner] =
        useState(null);

    const [preview, setPreview] =
        useState('');

    const [loading, setLoading] =
        useState(isEditing);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState('');

    useEffect(() => {
        document.title = isEditing
            ? 'Edit Workshop'
            : 'Create Workshop';
    }, [isEditing]);

    useEffect(() => {
        if (!isEditing) {
            return;
        }

        const loadWorkshop = async () => {
            try {
                const response = await api.get(
                    `/admin/workshops/${id}`,
                );

                const workshop =
                    response.data.data;

                setForm({
                    title:
                        workshop.title || '',
                    presenter:
                        workshop.presenter || '',
                    description:
                        workshop.description || '',
                    district:
                        workshop.district || '',
                    city:
                        workshop.city || '',
                    venue:
                        workshop.venue || '',
                    map_url:
                        workshop.map_url || '',
                    workshop_date:
                        workshop.workshop_date ||
                        '',
                    start_time:
                        workshop.start_time || '',
                    end_time:
                        workshop.end_time || '',
                    arrival_time:
                        workshop.arrival_time ||
                        '',
                    capacity:
                        workshop.capacity || 100,
                    registration_open_at:
                        workshop.registration_open_at ||
                        '',
                    registration_close_at:
                        workshop.registration_close_at ||
                        '',
                    status:
                        workshop.status ||
                        'draft',
                    whatsapp_group_url:
                        workshop.whatsapp_group_url ||
                        '',
                    is_featured:
                        Boolean(
                            workshop.is_featured,
                        ),
                });

                setPreview(
                    workshop.banner_url || '',
                );
            } catch (requestError) {
                setError(
                    requestError.response?.data
                        ?.message ||
                        'Unable to load workshop.',
                );
            } finally {
                setLoading(false);
            }
        };

        loadWorkshop();
    }, [id, isEditing]);

    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setForm((current) => ({
            ...current,
            [name]:
                type === 'checkbox'
                    ? checked
                    : value,
        }));
    };

    const handleBanner = (event) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        setBanner(file);

        const reader = new FileReader();

        reader.onload = () => {
            setPreview(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSubmitting(true);
        setError('');

        const formData = new FormData();

        Object.entries(form).forEach(
            ([key, value]) => {
                if (typeof value === 'boolean') {
                    formData.append(
                        key,
                        value ? '1' : '0',
                    );

                    return;
                }

                formData.append(
                    key,
                    value ?? '',
                );
            },
        );

        if (banner) {
            formData.append(
                'banner',
                banner,
            );
        }

        try {
            if (isEditing) {
                formData.append(
                    '_method',
                    'PUT',
                );

                await api.post(
                    `/admin/workshops/${id}`,
                    formData,
                );
            } else {
                await api.post(
                    '/admin/workshops',
                    formData,
                );
            }

            navigate('/admin/workshops', {
                replace: true,
            });
        } catch (requestError) {
            const validationErrors =
                requestError.response?.data
                    ?.errors;

            if (validationErrors) {
                setError(
                    Object.values(
                        validationErrors,
                    )
                        .flat()
                        .join(' '),
                );
            } else {
                setError(
                    requestError.response?.data
                        ?.message ||
                        'Unable to save workshop.',
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="py-20 text-center text-slate-500">
                Loading workshop...
            </div>
        );
    }

    return (
        <section>
            <Link
                to="/admin/workshops"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#071F42]"
            >
                <ArrowLeft className="h-4 w-4" />

                Back to Workshops
            </Link>

            <div className="mt-5">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
                    Workshop Management
                </p>

                <h2 className="mt-2 text-3xl font-black text-[#071F42]">
                    {isEditing
                        ? 'Edit Workshop'
                        : 'Create Workshop'}
                </h2>
            </div>

            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-6"
            >
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-black text-[#071F42]">
                        Basic Information
                    </h3>

                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                        <Field label="Workshop Title">
                            <input
                                required
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Presenter">
                            <input
                                required
                                name="presenter"
                                value={form.presenter}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </Field>

                        <div className="md:col-span-2">
                            <Field label="Description">
                                <textarea
                                    name="description"
                                    rows="4"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />
                            </Field>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-black text-[#071F42]">
                        Location
                    </h3>

                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                        <Field label="District">
                            <input
                                required
                                name="district"
                                value={form.district}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="City">
                            <input
                                required
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Venue">
                            <input
                                required
                                name="venue"
                                value={form.venue}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Google Maps URL">
                            <input
                                type="url"
                                name="map_url"
                                value={form.map_url}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </Field>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-black text-[#071F42]">
                        Date and Time
                    </h3>

                    <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        <Field label="Workshop Date">
                            <input
                                required
                                type="date"
                                name="workshop_date"
                                value={
                                    form.workshop_date
                                }
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Start Time">
                            <input
                                required
                                type="time"
                                name="start_time"
                                value={form.start_time}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="End Time">
                            <input
                                required
                                type="time"
                                name="end_time"
                                value={form.end_time}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Arrival Time">
                            <input
                                type="time"
                                name="arrival_time"
                                value={
                                    form.arrival_time
                                }
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Registration Opens">
                            <input
                                type="datetime-local"
                                name="registration_open_at"
                                value={
                                    form.registration_open_at
                                }
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Registration Closes">
                            <input
                                type="datetime-local"
                                name="registration_close_at"
                                value={
                                    form.registration_close_at
                                }
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Capacity">
                            <input
                                required
                                type="number"
                                min="1"
                                name="capacity"
                                value={form.capacity}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Status">
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="draft">
                                    Draft
                                </option>

                                <option value="registration_open">
                                    Registration Open
                                </option>

                                <option value="full">
                                    Full
                                </option>

                                <option value="registration_closed">
                                    Registration Closed
                                </option>

                                <option value="completed">
                                    Completed
                                </option>

                                <option value="cancelled">
                                    Cancelled
                                </option>

                                <option value="archived">
                                    Archived
                                </option>
                            </select>
                        </Field>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-black text-[#071F42]">
                            Workshop Banner
                        </h3>

                        {preview && (
                            <img
                                src={preview}
                                alt="Workshop banner preview"
                                className="mt-5 aspect-video w-full rounded-xl object-cover"
                            />
                        )}

                        <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-5 py-8 font-bold text-slate-600 hover:border-[#F5B400]">
                            <Upload className="h-5 w-5" />

                            Upload Banner

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleBanner}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-black text-[#071F42]">
                            Additional Settings
                        </h3>

                        <div className="mt-6">
                            <Field label="WhatsApp Group URL">
                                <input
                                    type="url"
                                    name="whatsapp_group_url"
                                    value={
                                        form.whatsapp_group_url
                                    }
                                    onChange={handleChange}
                                    className={
                                        inputClass
                                    }
                                />
                            </Field>
                        </div>

                        <label className="mt-6 flex items-center gap-3 rounded-xl bg-amber-50 p-4">
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={
                                    form.is_featured
                                }
                                onChange={handleChange}
                                className="h-5 w-5 rounded border-slate-300 text-[#F5B400]"
                            />

                            <span>
                                <span className="block font-black text-[#071F42]">
                                    Featured Workshop
                                </span>

                                <span className="text-sm text-slate-600">
                                    Display this
                                    workshop on the
                                    public homepage.
                                </span>
                            </span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Link
                        to="/admin/workshops"
                        className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#F5B400] px-6 py-3 font-black text-[#071F42] hover:bg-amber-300 disabled:opacity-60"
                    >
                        <Save className="h-5 w-5" />

                        {submitting
                            ? 'Saving...'
                            : 'Save Workshop'}
                    </button>
                </div>
            </form>
        </section>
    );
}

function Field({ label, children }) {
    return (
        <label className="block">
            <span className="text-sm font-bold text-slate-700">
                {label}
            </span>

            {children}
        </label>
    );
}
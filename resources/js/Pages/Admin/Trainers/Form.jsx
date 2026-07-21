import {
    ArrowLeft,
    Save,
    Upload,
    UserRound,
    X,
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
    name: '',
    role: '',
    bio: '',
    linkedin_url: '',
     youtube_url: '',
    facebook_url: '',
    display_order: '0',
    is_active: true,
};

export default function TrainerForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEditing = Boolean(id);

    const [form, setForm] =
        useState(initialForm);

    const [photo, setPhoto] =
        useState(null);

    const [photoPreview, setPhotoPreview] =
        useState('');

    const [
        existingPhoto,
        setExistingPhoto,
    ] = useState('');

    const [
        removePhoto,
        setRemovePhoto,
    ] = useState(false);

    const [loading, setLoading] =
        useState(isEditing);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState('');

    useEffect(() => {
        document.title = isEditing
            ? 'Edit Trainer'
            : 'Create Trainer';
    }, [isEditing]);

    useEffect(() => {
        if (!isEditing) {
            return;
        }

        const controller =
            new AbortController();

        const loadTrainer = async () => {
            setLoading(true);
            setError('');

            try {
                const response =
                    await api.get(
                        `/admin/trainers/${id}`,
                        {
                            signal:
                                controller.signal,
                        },
                    );

                const trainer =
                    response.data.data;

                setForm({
                    name:
                        trainer.name || '',

                    role:
                        trainer.role || '',

                    bio:
                        trainer.bio || '',

                    linkedin_url:
                        trainer.linkedin_url ||
                        '',
                         youtube_url:
                        trainer.youtube_url || '',

                    facebook_url:
                        trainer.facebook_url || '',

                    display_order:
                        String(
                            trainer.display_order ??
                                0,
                        ),

                    is_active:
                        Boolean(
                            trainer.is_active,
                        ),
                });

                setExistingPhoto(
                    trainer.photo_url || '',
                );
            } catch (requestError) {
                if (
                    requestError.code ===
                    'ERR_CANCELED'
                ) {
                    return;
                }

                setError(
                    getErrorMessage(
                        requestError,
                        'Unable to load trainer.',
                    ),
                );
            } finally {
                setLoading(false);
            }
        };

        loadTrainer();

        return () => {
            controller.abort();
        };
    }, [
        id,
        isEditing,
    ]);

    useEffect(() => {
        return () => {
            if (
                photoPreview.startsWith(
                    'blob:',
                )
            ) {
                URL.revokeObjectURL(
                    photoPreview,
                );
            }
        };
    }, [photoPreview]);

    const handleChange = (event) => {
        const {
            name,
            value,
            checked,
            type,
        } = event.target;

        setForm((current) => ({
            ...current,

            [name]:
                type === 'checkbox'
                    ? checked
                    : value,
        }));
    };

    const handlePhotoChange = (
        event,
    ) => {
        const selectedFile =
            event.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
        ];

        if (
            !allowedTypes.includes(
                selectedFile.type,
            )
        ) {
            setError(
                'Photo must be JPG, PNG or WEBP.',
            );

            event.target.value = '';

            return;
        }

        if (
            selectedFile.size >
            5 * 1024 * 1024
        ) {
            setError(
                'Photo size must be less than 5MB.',
            );

            event.target.value = '';

            return;
        }

        if (
            photoPreview.startsWith(
                'blob:',
            )
        ) {
            URL.revokeObjectURL(
                photoPreview,
            );
        }

        setError('');
        setPhoto(selectedFile);

        setPhotoPreview(
            URL.createObjectURL(
                selectedFile,
            ),
        );

        setRemovePhoto(false);
    };

    const clearPhoto = () => {
        if (
            photoPreview.startsWith(
                'blob:',
            )
        ) {
            URL.revokeObjectURL(
                photoPreview,
            );
        }

        setPhoto(null);
        setPhotoPreview('');
        setExistingPhoto('');
        setRemovePhoto(true);
    };

    const handleSubmit = async (
        event,
    ) => {
        event.preventDefault();

        setSubmitting(true);
        setError('');

        const formData =
            new FormData();

        formData.append(
            'name',
            form.name.trim(),
        );

        formData.append(
            'role',
            form.role.trim(),
        );

        formData.append(
            'bio',
            form.bio.trim(),
        );

        formData.append(
            'linkedin_url',
            form.linkedin_url.trim(),
        );

          formData.append(
            'youtube_url',
            form.youtube_url.trim(),
        );
          formData.append(
            'facebook_url',
            form.facebook_url.trim(),
        );

        formData.append(
            'display_order',
            form.display_order || '0',
        );

        formData.append(
            'is_active',
            form.is_active ? '1' : '0',
        );

        formData.append(
            'remove_photo',
            removePhoto ? '1' : '0',
        );

        if (photo) {
            formData.append(
                'photo',
                photo,
            );
        }

        try {
            if (isEditing) {
                formData.append(
                    '_method',
                    'PUT',
                );

                await api.post(
                    `/admin/trainers/${id}`,
                    formData,
                );
            } else {
                await api.post(
                    '/admin/trainers',
                    formData,
                );
            }

            navigate(
                '/admin/trainers',
            );
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'Unable to save trainer.',
                ),
            );
        } finally {
            setSubmitting(false);
        }
    };

    const displayedPhoto =
        photoPreview || existingPhoto;

    if (loading) {
        return (
            <div className="py-20 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#F5B400]" />

                <p className="mt-4 text-slate-500">
                    Loading trainer...
                </p>
            </div>
        );
    }

    return (
        <section>
            <div className="flex items-center gap-4">
                <Link
                    to="/admin/trainers"
                    className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-[#071F42] transition hover:border-[#F5B400] hover:bg-amber-50"
                    aria-label="Back to trainers"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>

                <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
                        Trainer Management
                    </p>

                    <h1 className="mt-1 text-3xl font-black text-[#071F42]">
                        {isEditing
                            ? 'Edit Trainer'
                            : 'Create Trainer'}
                    </h1>
                </div>
            </div>

            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]"
            >
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="font-black text-[#071F42]">
                        Trainer Photo
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Upload a clear portrait
                        photo of the trainer.
                    </p>

                    <div className="mt-5">
                        {displayedPhoto ? (
                            <div className="relative overflow-hidden rounded-2xl bg-slate-100">
                                <img
                                    src={
                                        displayedPhoto
                                    }
                                    alt="Trainer preview"
                                    className="aspect-[4/5] w-full object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={clearPhoto}
                                    className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700"
                                    aria-label="Remove photo"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="grid aspect-[4/5] place-items-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400">
                                <div className="text-center">
                                    <UserRound className="mx-auto h-16 w-16" />

                                    <p className="mt-3 text-sm font-bold">
                                        No photo selected
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#071F42] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0B2C5D]">
                        <Upload className="h-5 w-5" />

                        Upload Photo

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={
                                handlePhotoChange
                            }
                            className="hidden"
                        />
                    </label>

                    <p className="mt-3 text-center text-xs text-slate-500">
                        JPG, PNG or WEBP.
                        Maximum size 5MB.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <FormInput
                            label="Trainer Name"
                            name="name"
                            value={form.name}
                            onChange={
                                handleChange
                            }
                            placeholder="Enter trainer name"
                            required
                        />

                        <FormInput
                            label="Role / Position"
                            name="role"
                            value={form.role}
                            onChange={
                                handleChange
                            }
                            placeholder="Crypto Trading Mentor"
                            required
                        />

                        <FormInput
                            label="LinkedIn URL"
                            name="linkedin_url"
                            type="url"
                            value={
                                form.linkedin_url
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="https://linkedin.com/in/..."
                        />
                        <FormInput
                            label="YouTube URL"
                            name="youtube_url"
                            type="url"
                            value={form.youtube_url}
                            onChange={handleChange}
                            placeholder="https://youtube.com/@channel"
                        />

                        <FormInput
                            label="Facebook URL"
                            name="facebook_url"
                            type="url"
                            value={form.facebook_url}
                            onChange={handleChange}
                            placeholder="https://facebook.com/page"
                        />
                                                <FormInput
                            label="Display Order"
                            name="display_order"
                            type="number"
                            min="0"
                            max="65535"
                            value={
                                form.display_order
                            }
                            onChange={
                                handleChange
                            }
                        />

                        <label className="sm:col-span-2">
                            <span className="mb-2 block text-sm font-black text-[#071F42]">
                                Biography
                            </span>

                            <textarea
                                name="bio"
                                rows="7"
                                value={form.bio}
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter trainer biography..."
                                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0B2C5D] focus:ring-4 focus:ring-blue-100"
                            />
                        </label>

                        <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 p-4 sm:col-span-2">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={
                                    form.is_active
                                }
                                onChange={
                                    handleChange
                                }
                                className="h-5 w-5 rounded border-slate-300"
                            />

                            <span>
                                <strong className="block text-sm text-[#071F42]">
                                    Active Trainer
                                </strong>

                                <span className="text-xs text-slate-500">
                                    Display this
                                    trainer on the
                                    public website.
                                </span>
                            </span>
                        </label>
                    </div>

                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                        <Link
                            to="/admin/trainers"
                            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-100"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#F5B400] px-6 py-3 text-sm font-black text-[#071F42] transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save className="h-5 w-5" />

                            {submitting
                                ? 'Saving...'
                                : 'Save Trainer'}
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
}

function FormInput({
    label,
    required = false,
    ...inputProps
}) {
    return (
        <label>
            <span className="mb-2 block text-sm font-black text-[#071F42]">
                {label}

                {required && (
                    <span className="text-red-500">
                        {' '}
                        *
                    </span>
                )}
            </span>

            <input
                required={required}
                {...inputProps}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0B2C5D] focus:ring-4 focus:ring-blue-100"
            />
        </label>
    );
}

function getErrorMessage(
    error,
    fallback,
) {
    const validationErrors =
        error.response?.data?.errors;

    if (validationErrors) {
        return Object.values(
            validationErrors,
        )
            .flat()
            .join(' ');
    }

    return (
        error.response?.data?.message ||
        fallback
    );
}
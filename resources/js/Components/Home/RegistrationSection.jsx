import { useState } from 'react';

import api from '../../services/api';

const districts = [
    'Ampara',
    'Anuradhapura',
    'Badulla',
    'Batticaloa',
    'Colombo',
    'Galle',
    'Gampaha',
    'Hambantota',
    'Jaffna',
    'Kalutara',
    'Kandy',
    'Kegalle',
    'Kilinochchi',
    'Kurunegala',
    'Mannar',
    'Matale',
    'Matara',
    'Monaragala',
    'Mullaitivu',
    'Nuwara Eliya',
    'Polonnaruwa',
    'Puttalam',
    'Ratnapura',
    'Trincomalee',
    'Vavuniya',
];

const leadSources = [
    'TikTok',
    'Facebook',
    'Instagram',
    'YouTube',
    'WhatsApp',
    'Friend',
    'Other',
];

const initialForm = {
    full_name: '',
    mobile_number: '',
    whatsapp_number: '',
    email: '',
    district: '',
    age: '',
    occupation: '',
    trading_experience: 'false',
    binance_account: 'false',
    lead_source: '',
    consent: false,
};

export default function RegistrationSection({
    workshop,
    onRegistered,
}) {
    const [form, setForm] = useState(initialForm);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] =
        useState(false);

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!workshop?.id) {
            setError(
                'No active workshop is available for registration.',
            );

            return;
        }

        setSubmitting(true);
        setError('');
        setSuccess(null);

        const urlParameters =
            new URLSearchParams(
                window.location.search,
            );

        const payload = {
            workshop_id: workshop.id,

            full_name:
                form.full_name.trim(),

            mobile_number:
                form.mobile_number.trim(),

            whatsapp_number:
                form.whatsapp_number.trim() ||
                null,

            email:
                form.email.trim() || null,

            district:
                form.district,

            age:
                Number(form.age),

            occupation:
                form.occupation.trim() ||
                null,

            trading_experience:
                form.trading_experience ===
                'true',

            binance_account:
                form.binance_account ===
                'true',

            lead_source:
                form.lead_source,

            consent:
                form.consent,

            utm_source:
                urlParameters.get(
                    'utm_source',
                ),

            utm_medium:
                urlParameters.get(
                    'utm_medium',
                ),

            utm_campaign:
                urlParameters.get(
                    'utm_campaign',
                ),
        };

        try {
            const response = await api.post(
                '/registrations',
                payload,
            );

            setSuccess(
                response.data.data,
            );

            setForm(initialForm);

            if (onRegistered) {
                await onRegistered();
            }
        } catch (requestError) {
            const validationErrors =
                requestError.response?.data
                    ?.errors;

            if (validationErrors) {
                const message =
                    Object.values(
                        validationErrors,
                    )
                        .flat()
                        .join(' ');

                setError(message);
            } else {
                setError(
                    requestError.response?.data
                        ?.message ||
                        'Registration could not be completed.',
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (!workshop) {
        return (
            <section
                id="register"
                className="scroll-mt-28 bg-white px-4 py-12 sm:px-6 lg:px-8"
            >
                <div className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
                    <h2 className="text-2xl font-black text-[#071F42]">
                        Registration Unavailable
                    </h2>

                    <p className="mt-3 text-slate-600">
                        No featured workshop is
                        currently available.
                    </p>
                </div>
            </section>
        );
    }

    if (success) {
        return (
            <section
                id="register"
                className="scroll-mt-28 bg-white px-4 py-12 sm:px-6 lg:px-8"
            >
                <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center sm:p-10">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-600 text-3xl text-white">
                        ✓
                    </div>

                    <h2 className="mt-5 text-3xl font-black text-[#071F42]">
                        {success.status ===
                        'confirmed'
                            ? 'Seat Reserved'
                            : 'Added to Waitlist'}
                    </h2>

                    <p className="mt-3 text-slate-600">
                        Your registration was
                        submitted successfully.
                    </p>

                    <div className="mt-6 rounded-xl border border-emerald-200 bg-white p-5">
                        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                            Registration Reference
                        </p>

                        <p className="mt-2 text-2xl font-black text-[#071F42]">
                            {
                                success.referenceNumber
                            }
                        </p>
                    </div>

                    <div className="mt-6 space-y-2 text-sm text-slate-700">
                        <p>
                            <strong>
                                Workshop:
                            </strong>{' '}
                            {
                                success.workshopTitle
                            }
                        </p>

                        <p>
                            <strong>Date:</strong>{' '}
                            {
                                success.workshopDate
                            }
                        </p>

                        <p>
                            <strong>Venue:</strong>{' '}
                            {success.venue}
                        </p>
                    </div>

                    {success.whatsappGroupUrl &&
                        success.status ===
                            'confirmed' && (
                            <a
                                href={
                                    success.whatsappGroupUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="mt-6 inline-flex rounded-lg bg-emerald-600 px-6 py-3 font-black text-white transition hover:bg-emerald-700"
                            >
                                Join WhatsApp Group
                            </a>
                        )}

                    <button
                        type="button"
                        onClick={() =>
                            setSuccess(null)
                        }
                        className="mt-6 block w-full font-bold text-[#062C73]"
                    >
                        Back to Form
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section
            id="register"
            className="scroll-mt-28 bg-white px-4 py-5 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="grid lg:grid-cols-[260px_1fr]">
                    <div className="bg-slate-50 p-7">
                        <h2 className="text-2xl font-black uppercase text-[#071F42]">
                            Register Now
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            Fill in the form to
                            reserve your free seat
                            for {workshop.title}.
                        </p>

                        <p className="mt-4 text-sm font-black text-[#0B2C5D]">
                            {
                                workshop.seatsRemaining
                            }{' '}
                            seats remaining
                        </p>

                        <div className="mt-6 rounded-xl bg-[#071F42] p-5 text-white">
                            <p className="text-xs uppercase text-slate-300">
                                Workshop Date
                            </p>

                            <p className="mt-2 font-black text-[#F5B400]">
                                {workshop.date}
                            </p>

                            <p className="mt-1 text-sm text-slate-300">
                                {workshop.startTime}
                                {' - '}
                                {workshop.endTime}
                            </p>

                            <p className="mt-3 text-sm">
                                {workshop.venue}
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        <FormInput
                            label="Full Name"
                            name="full_name"
                            value={
                                form.full_name
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter your full name"
                            autoComplete="name"
                            required
                        />

                        <FormInput
                            label="Mobile Number"
                            name="mobile_number"
                            type="tel"
                            inputMode="tel"
                            value={
                                form.mobile_number
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="0771234567"
                            autoComplete="tel"
                            required
                        />

                        <FormInput
                            label="WhatsApp Number"
                            name="whatsapp_number"
                            type="tel"
                            inputMode="tel"
                            value={
                                form.whatsapp_number
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Optional"
                        />

                        <FormInput
                            label="Email Address"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={
                                handleChange
                            }
                            placeholder="you@example.com"
                            autoComplete="email"
                        />

                        <FormSelect
                            label="District"
                            name="district"
                            value={
                                form.district
                            }
                            onChange={
                                handleChange
                            }
                            required
                        >
                            <option value="">
                                Select District
                            </option>

                            {districts.map(
                                (district) => (
                                    <option
                                        key={
                                            district
                                        }
                                        value={
                                            district
                                        }
                                    >
                                        {
                                            district
                                        }
                                    </option>
                                ),
                            )}
                        </FormSelect>

                        <FormInput
                            label="Age"
                            name="age"
                            type="number"
                            min="13"
                            max="100"
                            inputMode="numeric"
                            value={form.age}
                            onChange={
                                handleChange
                            }
                            placeholder="Enter age"
                            required
                        />

                        <FormInput
                            label="Occupation"
                            name="occupation"
                            value={
                                form.occupation
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter occupation"
                        />

                        <FormSelect
                            label="Trading Experience"
                            name="trading_experience"
                            value={
                                form.trading_experience
                            }
                            onChange={
                                handleChange
                            }
                            required
                        >
                            <option value="false">
                                No
                            </option>

                            <option value="true">
                                Yes
                            </option>
                        </FormSelect>

                        <FormSelect
                            label="Binance Account"
                            name="binance_account"
                            value={
                                form.binance_account
                            }
                            onChange={
                                handleChange
                            }
                            required
                        >
                            <option value="false">
                                No
                            </option>

                            <option value="true">
                                Yes
                            </option>
                        </FormSelect>

                        <FormSelect
                            label="How did you hear about us?"
                            name="lead_source"
                            value={
                                form.lead_source
                            }
                            onChange={
                                handleChange
                            }
                            required
                        >
                            <option value="">
                                Select Lead Source
                            </option>

                            {leadSources.map(
                                (source) => (
                                    <option
                                        key={
                                            source
                                        }
                                        value={
                                            source
                                        }
                                    >
                                        {source}
                                    </option>
                                ),
                            )}
                        </FormSelect>

                        <label className="flex items-start gap-3 rounded-lg bg-slate-50 p-4 text-xs leading-5 text-slate-600 sm:col-span-2">
                            <input
                                required
                                type="checkbox"
                                name="consent"
                                checked={
                                    form.consent
                                }
                                onChange={
                                    handleChange
                                }
                                className="mt-1 h-4 w-4"
                            />

                            I agree to receive
                            workshop confirmations
                            and educational updates.
                        </label>

                        <button
                            type="submit"
                            disabled={
                                submitting ||
                                !workshop.canRegister
                            }
                            className="min-h-12 rounded-lg bg-[#F5B400] px-5 py-3 text-sm font-black uppercase text-[#071F42] transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting
                                ? 'Submitting...'
                                : workshop.ctaLabel ||
                                  'Reserve My Seat →'}
                        </button>

                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 sm:col-span-2 lg:col-span-3">
                                {error}
                            </div>
                        )}
                    </form>
                </div>

                <div className="flex items-start gap-3 bg-amber-50 px-6 py-4 text-xs leading-5 text-slate-700">
                    <span className="text-xl text-amber-600">
                        ⚠
                    </span>

                    <p>
                        <strong>
                            Risk disclaimer:
                        </strong>{' '}
                        Trading cryptocurrencies
                        involves significant risk.
                        This workshop is for
                        educational purposes only
                        and does not guarantee
                        profits or financial
                        outcomes.
                    </p>
                </div>
            </div>
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
            <span className="mb-1.5 block text-xs font-black text-[#071F42]">
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
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#0B2C5D] focus:ring-2 focus:ring-blue-100"
            />
        </label>
    );
}

function FormSelect({
    label,
    required = false,
    children,
    ...selectProps
}) {
    return (
        <label>
            <span className="mb-1.5 block text-xs font-black text-[#071F42]">
                {label}

                {required && (
                    <span className="text-red-500">
                        {' '}
                        *
                    </span>
                )}
            </span>

            <select
                required={required}
                {...selectProps}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#0B2C5D] focus:ring-2 focus:ring-blue-100"
            >
                {children}
            </select>
        </label>
    );
}
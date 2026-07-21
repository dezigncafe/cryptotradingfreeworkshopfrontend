import { useState } from 'react';

const faqs = [
    {
        question: 'Who can join this workshop?',
        answer:
            'Anyone interested in learning cryptocurrency trading can join. Complete beginners are welcome.',
    },
    {
        question: 'Do I need any prior knowledge?',
        answer:
            'No. The workshop begins with the fundamentals and explains everything step by step.',
    },
    {
        question: 'Is this really a free workshop?',
        answer:
            'Yes. Registration and attendance are completely free.',
    },
    {
        question: 'Will lunch or refreshments be provided?',
        answer:
            'Refreshment information will be included with your final workshop confirmation.',
    },
    {
        question: 'Do I need to bring anything?',
        answer:
            'Bring a smartphone, notebook and identification documents if you plan to create or verify a Binance account.',
    },
    {
        question: 'How can I reserve my seat?',
        answer:
            'Complete the registration form above. You will receive a confirmation after successful submission.',
    },
];

export default function FaqSection() {
    const [openItem, setOpenItem] = useState(null);

    return (
        <section
            id="faq"
            className="scroll-mt-28 bg-white px-4 py-7 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-7xl">
                <h2 className="text-2xl font-black uppercase text-[#071F42]">
                    Frequently Asked Questions
                </h2>

                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {faqs.map((faq, index) => {
                        const isOpen = openItem === index;

                        return (
                            <article
                                key={faq.question}
                                className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenItem(
                                            isOpen ? null : index,
                                        )
                                    }
                                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                                >
                                    <span className="text-sm font-bold text-[#071F42]">
                                        {faq.question}
                                    </span>

                                    <span
                                        className={`text-xl transition ${
                                            isOpen ? 'rotate-180' : ''
                                        }`}
                                    >
                                        ⌄
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="border-t border-slate-100 px-5 py-4">
                                        <p className="text-sm leading-6 text-slate-600">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
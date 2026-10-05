"use client";
import React, { useState } from 'react';
import { Mail, Instagram, Linkedin, Send } from 'lucide-react';
import { Container, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const ContactPage = () => {
    const [sending, setSending] = useState(false);
    const [feedback, setFeedback] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();
        if (sending) return;
        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form));
        setSending(true);
        setFeedback(null);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Unable to send your message. Please try again.');
            setFeedback({ success: true, text: "Message sent! We’ll reply to the email address you provided." });
            form.reset();
        } catch (error) {
            setFeedback({ success: false, text: error.message || 'Unable to send your message. Please try again.' });
        } finally {
            setSending(false);
        }
    }

    const fieldClass = 'mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-400/40 focus:border-blue-400';
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="relative isolate min-h-screen pb-16">
            {/* Top Gradient Background */}
            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#4a6ca7] to-[#25417a] opacity-35 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                />
            </div>

            {/* Contact Section */}
            <Container className="w-full" sx={{ marginTop: 15 }}>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] drop-shadow-2xl mb-4 text-center text-white">
                        Let&apos;s Connect!
                    </h1>

                    <Box className="text-center mt-6 mb-12">
                        <Typography variant="h6" className="text-gray-400 font-light">
                            Have questions about joining KTP or want to learn more?
                        </Typography>
                        <Typography variant="h6" className="text-gray-400 font-light mt-2">
                            Send us a message. We’d love to hear from you!
                        </Typography>
                        <Send className="h-6 w-6 text-blue-400 mx-auto mt-4 animate-bounce" />
                    </Box>

                    <section aria-labelledby="message-heading" className="mx-auto max-w-2xl rounded-2xl border border-white/15 bg-white/5 p-6 shadow-xl sm:p-8">
                        <h2 id="message-heading" className="text-2xl font-bold text-white">Send us a message</h2>
                        <p className="mt-2 text-sm text-slate-200">All fields are required.</p>
                        <form onSubmit={handleSubmit} className="mt-6 space-y-5" aria-busy={sending}>
                            <fieldset disabled={sending} className="space-y-5 disabled:opacity-70">
                                <div>
                                    <label htmlFor="contact-name" className="font-medium text-white">Name</label>
                                    <input id="contact-name" name="name" autoComplete="name" required maxLength={100} placeholder="Your full name" className={fieldClass} />
                                </div>
                                <div>
                                    <label htmlFor="contact-email" className="font-medium text-white">Email</label>
                                    <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" className={fieldClass} />
                                </div>
                                <div>
                                    <label htmlFor="contact-message" className="font-medium text-white">Message</label>
                                    <textarea id="contact-message" name="message" required minLength={10} maxLength={5000} rows={6} placeholder="How can we help?" className={`${fieldClass} resize-y`} />
                                </div>
                                <div className="hidden" aria-hidden="true">
                                    <label htmlFor="contact-website">Leave this field empty</label>
                                    <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
                                </div>
                            </fieldset>
                            <button disabled={sending} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300 disabled:cursor-wait disabled:opacity-60">
                                <Send aria-hidden="true" className="h-5 w-5" />
                                {sending ? 'Sending…' : 'Send Message'}
                            </button>
                            <p className="text-center text-sm text-slate-200">We’ll reach out to you with a response.</p>
                            <div aria-live="polite" aria-atomic="true">
                                {feedback && <p className={`rounded-lg border p-3 text-sm ${feedback.success ? 'border-green-300/40 bg-green-950/50 text-green-100' : 'border-red-300/40 bg-red-950/50 text-red-100'}`}>{feedback.text}</p>}
                            </div>
                        </form>
                    </section>

                    <section aria-labelledby="other-contact-heading" className="mt-12">
                        <h2 id="other-contact-heading" className="text-center text-xl font-semibold text-white">Other ways to connect</h2>
                        <div className="mt-5 grid gap-4 md:grid-cols-3">
                            {[
                                { href: 'mailto:ktpnewbrunswick@gmail.com', Icon: Mail, title: 'Email', detail: 'ktpnewbrunswick@gmail.com' },
                                { href: 'https://www.instagram.com/ktpnewbrunswick/', Icon: Instagram, title: 'Instagram', detail: '@ktpnewbrunswick' },
                                { href: 'https://www.linkedin.com/company/kappa-theta-pi-new-brunswick/', Icon: Linkedin, title: 'LinkedIn', detail: 'Kappa Theta Pi – New Brunswick' },
                            ].map(({ href, Icon, title, detail }) => (
                                <a key={title} href={href} {...(title !== 'Email' ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-5 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300">
                                    <Icon aria-hidden="true" className="h-6 w-6 shrink-0 text-blue-300" />
                                    <span className="min-w-0"><span className="block font-semibold">{title}</span><span className="block break-words text-sm text-slate-200">{detail}</span></span>
                                </a>
                            ))}
                        </div>
                    </section>

                    <Box className="text-center mt-16">
                        <Typography variant="body1" className="text-gray-400 italic">
                            &quot;Join us in shaping the future of technology and business!&quot;
                        </Typography>
                    </Box>
                </motion.div>
            </Container>

            {/* Bottom Gradient Background */}
            <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(0% 0%, 27.5% 0%, 45.2% 65.5%, 47.5% 41.7%, 52.4% 31.9%, 60.2% 37.6%, 72.5% 67.5%, 80.7% 98%, 85.5% 99.9%, 97.5% 73.1%, 100% 38.4%, 74.1% 55.9%, 76.1% 2.3%, 27.6% 23.2%, 17.9% 0%, 0.1% 35.1%)',
                    }}
                    className="relative right-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#4a6ca7] to-[#25417a] opacity-35 sm:right-[calc(50%-30rem)] sm:w-[72.1875rem]"
                />
            </div>
        </div>
    );
};

export default ContactPage;

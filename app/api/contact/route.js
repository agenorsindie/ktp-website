import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request) {
  // The recipient is fixed on the server; visitors cannot send to arbitrary addresses.
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Please submit the form from this website.' }, { status: 403 });
  }
  let data;
  try {
    const body = await request.text();
    if (body.length > 12000) return NextResponse.json({ error: 'Your message is too long.' }, { status: 413 });
    data = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid form submission.' }, { status: 400 });
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return NextResponse.json({ error: 'Invalid form submission.' }, { status: 400 });
  }
  if (data.website) return NextResponse.json({ ok: true });
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const message = typeof data.message === 'string' ? data.message.trim() : '';
  if (!name || name.length > 100 || /[\r\n]/.test(name) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10 || message.length > 5000) {
    return NextResponse.json({ error: 'Enter your name, a valid email, and a message between 10 and 5,000 characters.' }, { status: 400 });
  }
  const user = process.env.CONTACT_SMTP_USER;
  const pass = process.env.CONTACT_SMTP_APP_PASSWORD;
  if (!user || !pass) {
    return NextResponse.json({ error: 'The contact form is temporarily unavailable. Please email ktpnewbrunswick@gmail.com.' }, { status: 503 });
  }
  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 587, secure: false, requireTLS: true,
    auth: { user, pass },
    connectionTimeout: 6000, greetingTimeout: 6000, socketTimeout: 10000,
  });
  try {
    await transport.sendMail({
      from: user,
      to: 'ktpnewbrunswick@gmail.com',
      replyTo: email,
      subject: 'KTP website contact message',
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Your message could not be sent. Please try again or email ktpnewbrunswick@gmail.com.' }, { status: 502 });
  } finally {
    transport.close();
  }
}

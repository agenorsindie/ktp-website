# Contact page redesign

Branch: `sindie-contactform`. Based on the official KTP-NB master

The centered contact form follows sindie's Figma layout, with visible labels, a Send Message button, inline status feedback, and responsive icon cards below it. The shared header remains in place.

## Enable delivery

A site administrator must configure these server-only variables locally in `.env.local` and in the hosting environment:

```
CONTACT_SMTP_USER=your-approved-gmail-sender@gmail.com
CONTACT_SMTP_APP_PASSWORD=your-gmail-app-password
```

Use a Gmail app password for the approved sender. Never commit credentials or prefix them with NEXT_PUBLIC_. Messages always go to ktpnewbrunswick@gmail.com; Reply-To is the visitor's email. There is no automatic confirmation email to the visitor. Without configuration, the form reports that email delivery is unavailable and provides the direct email address.

The API validates input, rejects cross-origin browser submissions, and includes a hidden spam-trap field. Configure durable rate limiting for `/api/contact` in the hosting platform before enabling public delivery; the spam trap alone is not sufficient abuse protection.

## Check

Run `npm ci`, `npm run dev`, and open `/contact`. Check desktop and mobile layout, tab navigation, invalid email, short message, loading, missing configuration, delivery failure, and successful delivery using a controlled test inbox/configuration. No real email should be sent during automated tests.

## Add to your own GitHub fork

Fork https://github.com/KTP-NB/ktp-website in GitHub. Clone your fork, then apply the accompanying patch from its repository folder:

```
git switch -c cindy-contact-form
git apply /path/to/cindy-contact-form.patch
npm ci
npm run dev
```

After reviewing locally:

```
git add app/contact/page.js app/api/contact/route.js docs/contact-form.md
git commit -m "Add integrated contact form and redesign contact page"
git push -u origin cindy-contact-form
```

Open a pull request to KTP-NB/ktp-website master. Include the design screenshot, validation results, and the administrator setup requirement. A pushed branch or pull request does not itself update the live website.

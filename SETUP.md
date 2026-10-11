# Fwins Club — Razorpay membership setup

This update preserves the existing landing page and adds /membership.html with account creation, sign-in, plan selection, checkout and verified membership status. It is not deployed or connected to live credentials yet.

## 1. Supabase database
Back up the project first. Run supabase/migrations/202610110001_club_payments.sql in the Supabase SQL editor. It creates NEW club_orders and club_memberships tables; it does not migrate existing memberships or change existing profiles, events, announcements or their policies. If these new tables already exist, review the schema instead of rerunning blindly. The legacy React portal is not part of this build and its payment handler redirects to the new checkout.

Only the service role can write membership/payment records. Signed-in members can read only their own records. Review legacy memberships/profiles policies separately before enabling the old portal.

## 2. Supabase authentication
Enable email/password authentication. Set Site URL to https://fwinsclub.online and allow https://fwinsclub.online/membership.html as a redirect URL. Keep email confirmation enabled and configure production SMTP/email delivery. Users confirm email, then sign in before payment. Add the www domain only if used.

## 3. Secure Edge Function settings
In Supabase → Edge Functions → Secrets, set:
- RAZORPAY_KEY_ID: start with the TEST key ID.
- RAZORPAY_KEY_SECRET: corresponding TEST secret.
- RAZORPAY_WEBHOOK_SECRET: a distinct random secret; use the same value in Razorpay webhook settings.
- ALLOWED_ORIGINS: https://fwinsclub.online (comma-separated additional actual origins if required).

SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase. Never put the service role, Razorpay key secret or webhook secret in frontend variables or Git.

Deploy supabase/functions/club-payments with shared security.mjs. With the Supabase CLI:

    supabase login
    supabase link --project-ref woscejmphxfdujxifylr
    supabase functions deploy club-payments

config.toml disables the gateway JWT check to allow signed Razorpay webhooks. The function explicitly validates auth.getUser for create/verify and HMAC for webhook calls. Do not remove those checks.

## 4. Razorpay webhook and capture
Configure automatic capture in Razorpay. Add webhook:
https://woscejmphxfdujxifylr.supabase.co/functions/v1/club-payments?action=webhook
Subscribe to payment.captured and order.paid. Set the matching webhook secret. Test and live webhooks are configured separately. This implementation handles duplicate events transactionally, checks the payment against Razorpay's API and matches amount, currency, order and owner. It does not automatically process refunds, chargebacks, invoice email or community invitations; manage these separately before promising those features.

## 5. Netlify
Set these PUBLIC build environment variables:
- VITE_SUPABASE_URL=https://woscejmphxfdujxifylr.supabase.co
- VITE_SUPABASE_ANON_KEY=your Supabase public anon/publishable key

Upload these source changes to the repository connected to Netlify. Build command: npm run build. Publish directory: dist. netlify.toml is the active configuration; netlify.toml.txt in the original ZIP is not a Netlify configuration file.

For local build: copy .env.example to .env, enter only the public key, run npm ci then npm run build. For a manual Netlify deploy, upload dist AFTER a correctly configured build, not this source ZIP. Do not deploy an unconfigured build: checkout will show a setup message.

## 6. Required acceptance checks before live collection
- Confirm an email, sign in, buy each plan in TEST mode.
- Test failure, checkout dismissal and retry.
- Check price tampering, invalid signatures and unauthenticated requests are rejected.
- Confirm captured payment produces exactly one membership and duplicate webhook delivery does not extend it again.
- Close checkout after payment; confirm webhook activates membership without the browser callback.
- Confirm one member cannot read another member's payment or membership records.
- Verify expiry and lifetime behavior; check admin reconciliation in club_orders.
- Publish actual membership terms, privacy and refund policies and make them accessible before checkout. No policies have been invented in this update.
- Confirm ₹99/₹349/₹499 are your intended final amounts, including any applicable taxes. There is no recurring debit or subscription.
- Switch backend secrets to matching LIVE keys, configure LIVE webhook, then perform an owner-authorized live test. No real payment was made during preparation.

Verification completed locally: cryptographic helper tests and static production build (see delivery message for outcome). Database migration, deployed function, email delivery, Razorpay webhook and end-to-end payments still require access to your project/account.

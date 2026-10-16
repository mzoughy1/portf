# Mohamed Amine Mzoughi — portfolio

Personal site for a full-stack web developer. One page, a terminal you can type into, anonymous visit stats, a moderated guestbook, and a contact form. It deploys for free on Vercel, with data in Supabase and the repo on GitHub.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Framer Motion
- Supabase (Postgres + Storage)
- Zod
- Cloudflare Turnstile
- Resend, only when `RESEND_ENABLED=true`

No paid services are required. Vercel, Supabase, GitHub, Turnstile, and Resend all have free tiers.

## Project layout

```text
app/                  pages, metadata, sitemap, and API routes
app/api/contact       validated contact form
app/api/guestbook     approved notes + new notes
app/api/interests     anonymous intent tally
app/api/stats         aggregate visit stats
components/           interface
content/              editable CV content (TypeScript)
lib/                  Supabase clients, validation, rate limit, email
supabase/migrations   SQL for tables, RLS, stats, and the assets bucket
```

Edit copy in `content/`. The page reads those files directly, so a new project is a new object in `content/projects.ts`.

## Local setup

1. Use Node.js 22 if you can. CI uses 22. Node 20.17 runs the app, and ESLint prints an engine warning.
2. Install and copy the env file:

```powershell
npm install
copy .env.example .env.local
```

3. Start the site:

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The page renders without Supabase. Forms and live stats answer with a clear message until the keys below are set. Turnstile is skipped in local development when its secret is empty, and required in production.

## Environment variables

| Name | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical URL. On Vercel this falls back to the production host. |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Browser key. RLS limits what it can do. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Used by API routes. Never prefix it with `NEXT_PUBLIC_`. |
| `NEXT_PUBLIC_CV_URL` | Public | Public URL of the CV PDF in the `assets` bucket |
| `NEXT_PUBLIC_PHOTO_URL` | Public | Optional. A portrait is already at `/portrait.jpg` unless this URL is set |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public | Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Server only | Turnstile secret |
| `RESEND_ENABLED` | Server | `true` sends mail. Anything else stores the message only. |
| `RESEND_API_KEY` | Server | Resend API key |
| `RESEND_FROM` | Server | Verified sender, for example `Portfolio <hello@yourdomain.com>` |
| `CONTACT_TO_EMAIL` | Server | Inbox for notifications. Defaults to the address in `content/profile.ts`. |

## Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run `supabase/migrations/0001_init.sql`.
3. In Project Settings → API, copy the project URL, the `anon` key, and the `service_role` key into `.env.local` (and later into Vercel).
4. Confirm Storage has a public bucket named `assets`. The migration creates it.
5. Upload `cv.pdf` into `assets`, open the file, and copy its public URL into `NEXT_PUBLIC_CV_URL`.
6. Optional: replace `public/portrait.jpg`, or set `NEXT_PUBLIC_PHOTO_URL` to a file on this bucket so `next/image` can load it.

### What the database allows

Row Level Security is on for every table.

- `contacts` — visitors can insert. They cannot read rows.
- `visitor_interests` — visitors can insert an intent and topic labels. There is no name, email, or IP column. They cannot read rows. Aggregates come from `visitor_interest_stats()`.
- `guestbook` — visitors can insert, and new rows are forced to `approved = false`. Visitors can read only approved rows, including through the `guestbook_approved` view.

The site itself writes through the API routes, which validate with Zod, check Turnstile on the public forms, and rate-limit using the request IP in memory only. The IP is not stored, logged, or sent back.

Approve a guestbook note in the Supabase table editor: set `approved` to `true`. To delete a contact or a note, delete that row in the dashboard. That is the removal path described next to the forms.

The anon key can also insert directly, which matches the policies above. Turnstile cannot see those direct inserts. If you want the forms to be the only way in, run this after the migration:

```sql
drop policy if exists "Public insert contacts" on public.contacts;
drop policy if exists "Public insert guestbook" on public.guestbook;
drop policy if exists "Public insert visitor interests" on public.visitor_interests;
```

The service role used by the API bypasses RLS, so the site keeps working.

## Turnstile

1. Create a free widget at [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile).
2. Add your production domain, and `localhost` if you want to test the widget locally.
3. Put the site key and secret in the env vars above.

## Resend (optional)

Leave `RESEND_ENABLED=false` until you want email. Messages are still stored in `contacts`.

1. Create a free account at [resend.com](https://resend.com).
2. Verify a domain and set `RESEND_FROM` to an address on it.
3. Set `RESEND_ENABLED=true` and `RESEND_API_KEY`.

The Resend sandbox sender (`onboarding@resend.dev`) only delivers to the address on the Resend account. Use a verified domain before relying on it.

## Content you still fill in

- CV: set `NEXT_PUBLIC_CV_URL`. Until that URL is set, the download button stays disabled. The portrait is `public/portrait.jpg`.
- Projects: add an `image` public URL on any object in `content/projects.ts`.
- Availability: `availableForWork` in `content/profile.ts`.

## Deploy for free

### 1. GitHub

Create an empty public repository, then from this folder:

```powershell
git add .
git commit -m "Add the portfolio site"
git branch -M main
git remote add origin https://github.com/mzoughy1/portf.git
git push -u origin main
```

GitHub Actions runs `npm run lint` and `npm run typecheck` on every push.

### 2. Vercel

1. Sign in at [vercel.com](https://vercel.com) with GitHub.
2. Import the repository. Framework preset: Next.js. Do not change the build command.
3. Add every variable from `.env.example`. Mark `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`, and `RESEND_API_KEY` as sensitive.
4. Set `NEXT_PUBLIC_SITE_URL` to the production URL, for example `https://your-project.vercel.app`.
5. Deploy. Vercel builds on each push to `main`.

### 3. After the first deploy

1. In Turnstile, add the Vercel domain if it was not there yet.
2. Send yourself a contact message and a guestbook note.
3. In Supabase, confirm the contact row, then set the guestbook row to `approved`.
4. Reload the site and confirm the note is visible.

## Scripts

```powershell
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Privacy

The forms say what is stored. In short: contact rows keep name, email, message, and optional interest labels; guestbook rows keep name and note until you approve or delete them; visit stats keep only intent and topic labels. IP addresses are used in process memory to slow repeated submits, then discarded. Nothing in the database is an IP address or a browser fingerprint.

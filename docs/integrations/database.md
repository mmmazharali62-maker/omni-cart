# Postgres Database Setup

The app needs one Postgres database. Neon and Supabase both have free tiers
suitable for launch.

## Get a URL

**Neon (recommended)**
1. Sign up at neon.tech.
2. Create a project - pick a region near your customers (`aws-us-east-1` or `aws-eu-west-2`).
3. Copy the connection string (it looks like `postgres://user:pass@ep-xxx.aws.neon.tech/db?sslmode=require`).

**Supabase**
1. Sign up at supabase.com, create a project.
2. Settings → Database → Connection string (URI). Use the **pooled** connection for the app.

## Apply it

Option A (env): set `DATABASE_URL` in your deployment platform's env settings.

Option B (admin UI): Admin → Integrations → Postgres Database, paste the URL, Save.

## Migrate

After the URL is live, run:

```bash
npx prisma migrate deploy
npx prisma db seed   # optional: demo categories/suppliers
```

Note: a URL saved through the admin UI is stored for reference and testing, but
the running app connects using the `DATABASE_URL` env var at boot - set it once
when deploying, then the admin page just monitors it.

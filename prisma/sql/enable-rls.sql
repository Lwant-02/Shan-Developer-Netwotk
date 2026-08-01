-- Enable row-level security on every table, with NO policies. Deny by default.
--
-- WHY THIS EXISTS (PBI-027)
--
-- Supabase publishes every table in the `public` schema over PostgREST at
-- `https://<project>.supabase.co/rest/v1/`, and the anon key that opens it is *meant* to
-- be public — it ships in browser code. RLS is the only thing between that endpoint and
-- the data. Prisma migrations do NOT enable it, so tables created by `prisma migrate` are
-- world-readable until this runs. That is the sharpest edge of running Prisma on Supabase,
-- and it is silent: nothing in the app misbehaves while the data is exposed.
--
-- The application is unaffected. Prisma connects with a privileged role that bypasses RLS,
-- and authorization lives in the server handlers next to the rate limits. This is a lock
-- on a door the app does not walk through.
--
-- FORCE, not just ENABLE: `ENABLE` alone still exempts the table owner, which is the role
-- Prisma's migration user typically owns the tables as. `FORCE` closes that gap for any
-- non-superuser connection.
--
-- Adding policies later is additive and safe. Removing this is not — do not disable RLS to
-- "make something work". If a browser-side query needs data (Supabase Realtime, a client
-- component, chat), write a policy for that one table instead.
--
-- Run after `prisma migrate`, and re-run after any migration that adds a table. It is
-- idempotent.

DO $$
DECLARE
  t record;
BEGIN
  FOR t IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      -- Prisma's own bookkeeping table; enabled below, but without FORCE.
      AND tablename <> '_prisma_migrations'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t.tablename);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY;', t.tablename);
  END LOOP;
END $$;

-- `_prisma_migrations` is in `public` too, so PostgREST publishes it like everything else —
-- an unauthenticated read of the schema's entire change history. ENABLE only, never FORCE:
-- `prisma migrate` writes here on every deploy, and the one table that must never be
-- lockable by its own backstop is the one migrations depend on.
ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY;

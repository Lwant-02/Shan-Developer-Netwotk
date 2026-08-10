DO $$
DECLARE
  t record;
BEGIN
  FOR t IN
    SELECT schemaname, tablename
    FROM pg_tables
    WHERE schemaname IN ('public', 'app_auth')
      AND tablename <> '_prisma_migrations'
  LOOP
    EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY;', t.schemaname, t.tablename);
    EXECUTE format('ALTER TABLE %I.%I FORCE ROW LEVEL SECURITY;', t.schemaname, t.tablename);
  END LOOP;
END $$;

ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON SCHEMA app_auth FROM anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA app_auth FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA app_auth REVOKE ALL ON TABLES FROM anon, authenticated;

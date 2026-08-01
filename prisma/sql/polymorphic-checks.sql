-- CHECK constraints Prisma cannot express (PBI-027).
--
-- `comments`, `stars`, `notifications`, and `reports` each point at a post OR a project OR
-- an event through nullable foreign keys, because Prisma has no polymorphic relation.
-- Nothing in the schema stops a row setting two of them at once — a comment attached to
-- both a post and a project would render in two places and be counted twice.
--
-- These constraints put the rule where it cannot be forgotten. Run after `prisma migrate`,
-- and remember them when adding a reportable or commentable surface: a new target column
-- means updating the matching constraint here.
--
-- No quoted identifiers: the schema maps everything to snake_case precisely so this file,
-- RLS policies, and the Supabase SQL editor can all be written plainly.

-- Exactly one target.
alter table public.comments
  drop constraint if exists comments_one_target,
  add constraint comments_one_target check (
    ((post_id is not null)::int
      + (project_id is not null)::int
      + (event_id is not null)::int) = 1
  );

alter table public.stars
  drop constraint if exists stars_one_target,
  add constraint stars_one_target check (
    ((project_id is not null)::int + (event_id is not null)::int) = 1
  );

alter table public.reports
  drop constraint if exists reports_one_target,
  add constraint reports_one_target check (
    ((post_id is not null)::int
      + (project_id is not null)::int
      + (event_id is not null)::int) = 1
  );

-- Notifications are looser on purpose: a `comment` notification carries both the comment
-- and the post it sits on, and `eventReminder` carries only the event. So the rule is
-- "at most one *content* target", not "exactly one column".
alter table public.notifications
  drop constraint if exists notifications_one_target,
  add constraint notifications_one_target check (
    ((post_id is not null)::int
      + (project_id is not null)::int
      + (event_id is not null)::int) <= 1
  );

-- `eventReminder` comes from the event itself and has no actor; everything else does.
alter table public.notifications
  drop constraint if exists notifications_actor_presence,
  add constraint notifications_actor_presence check (
    (kind = 'eventReminder' and actor_id is null)
    or (kind <> 'eventReminder' and actor_id is not null)
  );

-- Nobody follows themselves.
alter table public.follows
  drop constraint if exists follows_not_self,
  add constraint follows_not_self check (follower_id <> following_id);

-- A member cannot close their own report. Cheap here, easy to miss in review.
alter table public.reports
  drop constraint if exists reports_not_self_resolved,
  add constraint reports_not_self_resolved check (
    resolved_by_id is null or resolved_by_id <> reporter_id
  );

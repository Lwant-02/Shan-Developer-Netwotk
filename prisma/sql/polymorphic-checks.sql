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

alter table public.notifications
  drop constraint if exists notifications_one_target,
  add constraint notifications_one_target check (
    ((post_id is not null)::int
      + (project_id is not null)::int
      + (event_id is not null)::int) <= 1
  );

alter table public.notifications
  drop constraint if exists notifications_actor_presence,
  add constraint notifications_actor_presence check (
    (kind = 'eventReminder' and actor_id is null)
    or (kind <> 'eventReminder' and actor_id is not null)
  );

alter table public.follows
  drop constraint if exists follows_not_self,
  add constraint follows_not_self check (follower_id <> following_id);

alter table public.reports
  drop constraint if exists reports_not_self_resolved,
  add constraint reports_not_self_resolved check (
    resolved_by_id is null or resolved_by_id <> reporter_id
  );

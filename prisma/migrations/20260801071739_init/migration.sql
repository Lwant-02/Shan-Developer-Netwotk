-- CreateEnum
CREATE TYPE "content_lang" AS ENUM ('shn', 'en');

-- CreateEnum
CREATE TYPE "social_platform" AS ENUM ('github', 'facebook', 'instagram', 'line', 'linkedin', 'telegram', 'website');

-- CreateEnum
CREATE TYPE "report_reason" AS ENUM ('spam', 'harassment', 'hate', 'violence', 'privateInfo', 'impersonation', 'malware', 'sexual', 'offTopic', 'other');

-- CreateEnum
CREATE TYPE "report_state" AS ENUM ('open', 'resolved', 'dismissed');

-- CreateEnum
CREATE TYPE "notification_kind" AS ENUM ('comment', 'like', 'star', 'follow', 'eventReminder');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "auth_user_id" UUID NOT NULL,
    "handle" TEXT NOT NULL,
    "display_name" TEXT,
    "role" TEXT NOT NULL DEFAULT '',
    "bio" TEXT NOT NULL DEFAULT '',
    "location" TEXT,
    "avatar_path" TEXT,
    "listed" BOOLEAN NOT NULL DEFAULT true,
    "moderator" BOOLEAN NOT NULL DEFAULT false,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_links" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "platform" "social_platform" NOT NULL,
    "href" TEXT NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "author_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "lang" "content_lang" NOT NULL,
    "image_path" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "author_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lang" "content_lang" NOT NULL,
    "image_path" TEXT,
    "repo_url" TEXT,
    "website_url" TEXT,
    "app_store_url" TEXT,
    "play_store_url" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "host_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lang" "content_lang" NOT NULL,
    "image_path" TEXT,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "online" BOOLEAN NOT NULL DEFAULT true,
    "location" TEXT NOT NULL DEFAULT '',
    "join_url" TEXT,
    "register_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "lang" "content_lang" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parent_id" UUID,
    "post_id" UUID,
    "project_id" UUID,
    "event_id" UUID,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stars" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "project_id" UUID,
    "event_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "id" UUID NOT NULL,
    "follower_id" UUID NOT NULL,
    "following_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "recipient_id" UUID NOT NULL,
    "kind" "notification_kind" NOT NULL,
    "actor_id" UUID,
    "post_id" UUID,
    "project_id" UUID,
    "event_id" UUID,
    "comment_id" UUID,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL,
    "reporter_id" UUID NOT NULL,
    "reason" "report_reason" NOT NULL,
    "state" "report_state" NOT NULL DEFAULT 'open',
    "post_id" UUID,
    "project_id" UUID,
    "event_id" UUID,
    "resolved_at" TIMESTAMP(3),
    "resolved_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_auth_user_id_key" ON "profiles"("auth_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_handle_key" ON "profiles"("handle");

-- CreateIndex
CREATE INDEX "profiles_listed_idx" ON "profiles"("listed");

-- CreateIndex
CREATE UNIQUE INDEX "social_links_profile_id_platform_key" ON "social_links"("profile_id", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");

-- CreateIndex
CREATE INDEX "posts_created_at_idx" ON "posts"("created_at");

-- CreateIndex
CREATE INDEX "posts_author_id_idx" ON "posts"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_created_at_idx" ON "projects"("created_at");

-- CreateIndex
CREATE INDEX "projects_author_id_idx" ON "projects"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_starts_at_idx" ON "events"("starts_at");

-- CreateIndex
CREATE INDEX "events_host_id_idx" ON "events"("host_id");

-- CreateIndex
CREATE INDEX "comments_post_id_idx" ON "comments"("post_id");

-- CreateIndex
CREATE INDEX "comments_project_id_idx" ON "comments"("project_id");

-- CreateIndex
CREATE INDEX "comments_event_id_idx" ON "comments"("event_id");

-- CreateIndex
CREATE INDEX "comments_author_id_idx" ON "comments"("author_id");

-- CreateIndex
CREATE INDEX "comments_parent_id_idx" ON "comments"("parent_id");

-- CreateIndex
CREATE INDEX "comments_created_at_idx" ON "comments"("created_at");

-- CreateIndex
CREATE INDEX "likes_post_id_idx" ON "likes"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_profile_id_post_id_key" ON "likes"("profile_id", "post_id");

-- CreateIndex
CREATE INDEX "stars_project_id_idx" ON "stars"("project_id");

-- CreateIndex
CREATE INDEX "stars_event_id_idx" ON "stars"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "stars_profile_id_project_id_key" ON "stars"("profile_id", "project_id");

-- CreateIndex
CREATE UNIQUE INDEX "stars_profile_id_event_id_key" ON "stars"("profile_id", "event_id");

-- CreateIndex
CREATE INDEX "follows_following_id_idx" ON "follows"("following_id");

-- CreateIndex
CREATE UNIQUE INDEX "follows_follower_id_following_id_key" ON "follows"("follower_id", "following_id");

-- CreateIndex
CREATE INDEX "notifications_recipient_id_created_at_idx" ON "notifications"("recipient_id", "created_at");

-- CreateIndex
CREATE INDEX "notifications_recipient_id_read_at_idx" ON "notifications"("recipient_id", "read_at");

-- CreateIndex
CREATE INDEX "notifications_actor_id_idx" ON "notifications"("actor_id");

-- CreateIndex
CREATE INDEX "notifications_post_id_idx" ON "notifications"("post_id");

-- CreateIndex
CREATE INDEX "notifications_project_id_idx" ON "notifications"("project_id");

-- CreateIndex
CREATE INDEX "notifications_event_id_idx" ON "notifications"("event_id");

-- CreateIndex
CREATE INDEX "notifications_comment_id_idx" ON "notifications"("comment_id");

-- CreateIndex
CREATE INDEX "reports_state_created_at_idx" ON "reports"("state", "created_at");

-- CreateIndex
CREATE INDEX "reports_reporter_id_idx" ON "reports"("reporter_id");

-- CreateIndex
CREATE INDEX "reports_resolved_by_id_idx" ON "reports"("resolved_by_id");

-- CreateIndex
CREATE INDEX "reports_post_id_idx" ON "reports"("post_id");

-- CreateIndex
CREATE INDEX "reports_project_id_idx" ON "reports"("project_id");

-- CreateIndex
CREATE INDEX "reports_event_id_idx" ON "reports"("event_id");

-- AddForeignKey
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stars" ADD CONSTRAINT "stars_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stars" ADD CONSTRAINT "stars_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stars" ADD CONSTRAINT "stars_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_resolved_by_id_fkey" FOREIGN KEY ("resolved_by_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

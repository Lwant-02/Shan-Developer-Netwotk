# PBI-013 — Choose image and file storage

| | |
| --- | --- |
| **Status** | Proposed |
| **Created** | 2026-07-18 |
| **Depends on** | PBI-007 (auth) for any user-uploaded content |

## Problem

The database decision landed on **Neon**, which is Postgres and nothing else. The
alternative considered in `design.md` was Supabase, which bundles storage and image
handling — so choosing Neon left a gap that hasn't been filled.

Nothing needs storage today. Several near-term things do:

- Profile avatars
- Images in posts
- Project screenshots
- Event banners

`design.md`'s data model sketch already anticipates these; there is no answer for
where the bytes live.

## Why it matters

Storage is the kind of decision that is cheap now and expensive later. Once avatars
exist and URLs are in the database, migrating providers means rewriting stored URLs
and re-uploading content.

There is also a cost angle specific to this audience: images are the heaviest thing a
mid-range Android phone on mobile data will download. Whatever is chosen needs
**automatic resizing and modern formats**, not just a bucket.

## Conditions of Satisfaction

1. A storage provider is chosen and recorded in `design.md`.
2. The decision accounts for: upload path, transformation/resizing, CDN delivery, and
   cost at low volume.
3. Images are served responsively — correct dimensions and a modern format
   (WebP/AVIF), not full-size originals scaled in CSS.
4. Uploads are authenticated and rate limited (PBI-008 applies — an upload endpoint is
   a write endpoint).
5. File type and size are validated server-side.
6. **Identity safety holds:** uploaded files must not leak EXIF GPS data. Location is
   coarse and optional by design, and an unstripped photo defeats that entirely.
7. Public read access works — images render for anonymous visitors without signed URLs
   that expire.

## Notes

- **This needs a human decision.** Options include Vercel Blob (closest to the
  existing stack), Cloudflare R2 (cheap egress), Cloudinary or imgix
  (transformations), or an S3-compatible bucket. Each is a different cost and
  complexity tradeoff.
- `next/image` handles a lot of the delivery concern and is already available — the
  choice is mainly about where originals live and who does the transformation.
- The **EXIF stripping** point in CoS 6 is not boilerplate. This project treats
  identity as a safety requirement, and photo metadata is the most common accidental
  disclosure of exact location.
- Not urgent. Don't build this before something actually needs to store a file — but
  decide it before PBI-010 or a profile feature assumes an answer.

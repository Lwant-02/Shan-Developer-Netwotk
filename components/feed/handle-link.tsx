import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// A pseudonymous handle, linked to its profile (PBI-017). One place so the feed card,
// the post detail header, and comments all route the same way. The handle is the URL
// key; it never carries an "@" or asserts a real identity.
export function HandleLink({
  handle,
  className,
}: {
  handle: string;
  className?: string;
}) {
  return (
    <Link
      href={`/developers/${handle}`}
      className={cn("underline-offset-2 hover:underline", className)}
    >
      {handle}
    </Link>
  );
}

import { Swirling } from "@/components/ui/swirling";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-screen w-full items-center justify-center"
    >
      <Swirling className="text-muted-foreground size-16" />
    </div>
  );
}

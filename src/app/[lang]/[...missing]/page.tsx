import { notFound } from "next/navigation";

// Catch-all for unknown routes under a locale (e.g., /ge/anything)
// Delegates to src/app/[lang]/not-found.tsx and returns proper 404 status
export default function MissingCatchAll() {
  notFound();
}

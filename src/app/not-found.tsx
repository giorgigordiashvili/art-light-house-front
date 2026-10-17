import Link from "next/link";

// Fallback 404 for requests that never reach app/[lang]. The root layout renders no
// <html>/<body> (that shell lives in app/[lang]/layout.tsx), so this page provides its own.
export default function RootNotFound() {
  return (
    <html lang="ka">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          background: "#0b0b0b",
          color: "#fafafa",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 48 }}>404</h1>
        <p style={{ margin: 0 }}>გვერდი ვერ მოიძებნა / Page not found</p>
        <Link href="/ge" style={{ color: "#FFCB40" }}>
          მთავარი / Home
        </Link>
      </body>
    </html>
  );
}

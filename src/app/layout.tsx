export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <title>Art Light House</title>
        <meta name="description" content="Art Light House - Premium lighting solutions" />
      </head>
      <body>{children}</body>
    </html>
  );
}

export const metadata = {
  title: "Art Light House",
  description: "This is Art Light House shop website",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

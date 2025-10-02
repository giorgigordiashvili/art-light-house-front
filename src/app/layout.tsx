export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Art Light House</title>
        <meta name="description" content="Art Light House - Premium lighting solutions" />
      </head>
      <body>{children}</body>
    </html>
  );
}

export const metadata = {
  title: "Art Light House",
  description: "This is my Next.js app",
  icons: {
    icon: "/favicon.png",
  },
};

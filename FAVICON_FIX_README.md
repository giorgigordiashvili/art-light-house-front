# Favicon troubleshooting for Next.js

1. Make sure you have a `favicon.ico` in the `/public` directory. This is the default location Next.js expects for favicons.
2. If you want to support multiple formats (ico, png, apple-touch-icon), place all of them in `/public`.
3. In your `layout.tsx`, use only the following for best compatibility:

```tsx
<link rel="icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

4. Remove duplicate or unnecessary favicon links from `<head>`.
5. Do not use `/favicon.png` as the main favicon for all browsers; use `/favicon.ico` for best cross-browser support.
6. If you only have a PNG, convert it to ICO (many free tools online) and place it as `/public/favicon.ico`.
7. After changes, clear your browser cache and redeploy.

## Example `/public` directory

- /public/favicon.ico
- /public/favicon.png (optional)
- /public/apple-touch-icon.png (optional)

## Example layout.tsx snippet

```tsx
<head>
  <link rel="icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  ...
</head>
```

## Note

- Netlify and Vercel both expect `/public/favicon.ico` for static serving.
- If you use Next.js `metadata` API, set `icon: '/favicon.ico'`.

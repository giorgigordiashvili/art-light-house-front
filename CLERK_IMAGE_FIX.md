# Clerk Image Troubleshooting

This document explains how we fixed the Clerk image loading issues and what to do if they occur again in the future.

## Fixed Issues

### 1. Missing image at `/path/to/star.png`

- Issue: There was a placeholder URL in `CategorySection.tsx` that pointed to a non-existent image file
- Fix: Updated the URL to use an existing image at `/assets/stars.svg`
- File fixed: `/src/components/MainPage/HeroAndCategory/CategorySection.tsx`

### 2. 400 Bad Request for Clerk images

- Issue: The Next.js image configuration didn't include all possible Clerk image domains
- Fix: Added additional Clerk image domains to the Next.js configuration
- File fixed: `/next.config.ts`

## Current Configuration

### Next.js Image Configuration

The following domains are now configured in `next.config.ts`:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'img.clerk.com',
      pathname: '**',
    },
    {
      protocol: 'https',
      hostname: 'images.clerk.dev',
      pathname: '**',
    },
    {
      protocol: 'https',
      hostname: 'cdn.clerk.dev',
      pathname: '**',
    },
    {
      protocol: 'https',
      hostname: 'cdn.clerk.app',
      pathname: '**',
    }
  ],
},
```

### Clerk Provider Configuration

Enhanced Clerk appearance settings in `src/app/layout.tsx`:

```jsx
<ClerkProvider
  appearance={{
    elements: {
      formButtonPrimary: "bg-yellow-500 hover:bg-yellow-600 text-black",
      captchaContainer: "w-full flex justify-center my-4",
      userButtonAvatarBox: "w-10 h-10 overflow-hidden",
      userButtonAvatarImage: "w-full h-full object-cover",
      avatarBox: "overflow-hidden rounded-full",
      avatarImage: "w-full h-full object-cover"
    },
    layout: {
      logoPlacement: "inside",
      showOptionalFields: true,
      helpPageUrl: "https://art-light-house.netlify.app/help",
      privacyPageUrl: "https://art-light-house.netlify.app/privacy",
      termsPageUrl: "https://art-light-house.netlify.app/terms"
    }
  }}
>
```

## Future Troubleshooting

If you encounter image loading issues again:

1. **Check browser developer console** for specific errors related to images
2. **Verify image domains**: If you see 400 errors for specific domains, add them to `next.config.ts` under `images.remotePatterns`
3. **Clerk appearance updates**: For Clerk UI problems, update the appearance configuration in `layout.tsx`
4. **CAPTCHA issues**: Ensure the `clerk-captcha` div is present in your layout and authorization pages

## Testing After Deployment

After deploying, check the following:

1. User avatars load correctly when signed in
2. OAuth provider buttons display correctly with their logos
3. The category section displays all images properly
4. No 404 or 400 errors appear in the browser console for images

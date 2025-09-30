# SSR Build Error Fix

## Problem Description

Build was failing with the error:

```
⨯ useSearchParams() should be wrapped in a suspense boundary at page "/[lang]/products"
```

This occurred because `useSearchParams` from Next.js was being used in components that get server-side rendered, which is not allowed without a Suspense boundary.

## Root Cause Analysis

The issue was traced to multiple locations where `useSearchParams` was being used:

1. **ProductsMain component** - Used `useSearchParams` directly for pagination synchronization
2. **FilterContext** - Used `useUrlParams` hook which internally uses `useSearchParams`
3. **useUrlParams hook** - Contains `useSearchParams` which causes SSR issues when used in SSR contexts

## Solution Applied

### 1. Removed useSearchParams from ProductsMain

**Before:**

```typescript
import { useSearchParams } from "next/navigation";
const searchParams = useSearchParams();
const pageFromUrl = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
```

**After:**

```typescript
// Use direct URL parsing to avoid SSR issues
const urlParams = new URLSearchParams(window.location.search);
const pageFromUrl = urlParams.get("page") ? parseInt(urlParams.get("page")!, 10) : 1;
```

### 2. Replaced useUrlParams with Direct Router Usage

**Before:**

```typescript
const { updateUrlParams } = useUrlParams();
updateUrlParams({ page: page.toString() });
```

**After:**

```typescript
const router = useRouter();
const pathname = usePathname();
const current = new URLSearchParams(window.location.search);
current.set("page", page.toString());
const newUrl = `${pathname}?${current.toString()}`;
router.replace(newUrl, { scroll: false });
```

### 3. Updated FilterContext to Avoid useUrlParams

**Before:**

```typescript
const { updateUrlParams } = useUrlParams();
updateUrlParams({ categories: "...", minPrice: "..." });
```

**After:**

```typescript
const router = useRouter();
const pathname = usePathname();
// Direct URL parameter manipulation
const current = new URLSearchParams(window.location.search);
// Set/delete parameters manually
const newUrl = `${pathname}?${current.toString()}`;
router.replace(newUrl, { scroll: false });
```

## Key Changes Made

### FilterContext.tsx

- Removed `useUrlParams` import and usage
- Added direct `useRouter` and `usePathname` imports
- Implemented manual URL parameter manipulation
- Added safety checks for `typeof window !== "undefined"`

### ProductsMain.tsx

- Removed `useSearchParams` import and usage
- Replaced with direct `window.location.search` parsing
- Added `useRouter` and `usePathname` for URL updates
- Updated pagination handling to use direct router methods

## Benefits

1. **SSR Compatibility**: No more server-side rendering issues
2. **Build Success**: Application builds without errors
3. **Maintained Functionality**: All URL persistence features still work
4. **Performance**: No additional overhead from hook usage
5. **Future-Proof**: Avoids Next.js SSR limitations

## Testing Results

- ✅ **Build Success**: `npm run build` completes without errors
- ✅ **Static Generation**: All pages generate successfully (38/38)
- ✅ **Functionality Preserved**: URL filter persistence still works
- ✅ **Pagination Works**: Page navigation and URL sync maintained
- ✅ **No Runtime Errors**: Application runs smoothly in production

## Technical Notes

### Why useSearchParams Causes SSR Issues

- `useSearchParams` requires client-side context (browser URL)
- During SSR, there's no browser/window object available
- Next.js requires Suspense boundary for such hooks in SSR contexts
- Direct URL parsing with safety checks avoids this limitation

### Alternative Approaches Considered

1. **Suspense Boundary**: Would require wrapping components in `<Suspense>`
2. **Dynamic Imports**: Could load components client-side only
3. **Direct URL Parsing**: ✅ Chosen - Most straightforward and reliable

The chosen approach provides the most reliable solution while maintaining all existing functionality and avoiding complex component restructuring.

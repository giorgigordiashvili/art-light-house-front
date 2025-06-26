# ImageKit Integration Documentation

This document describes the ImageKit integration for file uploads in the Art Light House admin dashboard.

## Overview

The application now uses ImageKit.io for image storage and management, replacing manual URL input with drag-and-drop file uploads.

## Environment Variables

The following environment variables are configured in `.env.local`:

```bash
# ImageKit.io Configuration
IMAGEKIT_PUBLIC_KEY=public_UTgyBFJykEp3+Fp4AuRXk6gFqOk=
IMAGEKIT_PRIVATE_KEY=private_U9yOwY6LcesQtyAwmL8lPB9WlDo=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/uip2jjety/
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_UTgyBFJykEp3+Fp4AuRXk6gFqOk=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/uip2jjety/
```

## API Endpoints

### 1. Authentication Endpoint

- **URL**: `/api/upload/auth`
- **Method**: `GET`
- **Description**: Returns authentication parameters for client-side uploads
- **Response**:
  ```json
  {
    "token": "uuid-token",
    "expire": timestamp,
    "signature": "signature-hash"
  }
  ```

### 2. Upload Endpoint

- **URL**: `/api/upload/image`
- **Method**: `POST`
- **Description**: Upload images to ImageKit
- **Body**: `FormData` with:
  - `file`: Image file
  - `fileName`: Optional filename
  - `folder`: Optional folder path (default: 'products')
- **Response**:
  ```json
  {
    "fileId": "file-id",
    "name": "filename.jpg",
    "url": "https://ik.imagekit.io/.../image.jpg",
    "thumbnailUrl": "https://ik.imagekit.io/.../tr:h-300,w-400/image.jpg",
    "filePath": "/folder/filename.jpg",
    "size": 12345,
    "fileType": "image/jpeg"
  }
  ```

### 3. Delete Endpoint

- **URL**: `/api/upload/image?fileId={fileId}`
- **Method**: `DELETE`
- **Description**: Delete image from ImageKit
- **Response**: `{ "success": true }`

## Components

### ImageUpload Component

A reusable component for handling file uploads with drag-and-drop functionality.

**Location**: `/src/components/shared/ImageUpload.tsx`

**Props**:

```typescript
interface ImageUploadProps {
  onImagesChange: (images: UploadedImage[]) => void;
  initialImages?: UploadedImage[];
  maxFiles?: number; // Default: 10
  folder?: string; // Default: 'products'
  disabled?: boolean;
}
```

**Features**:

- Drag and drop file upload
- Multiple file selection
- Image preview with thumbnails
- File validation (type and size)
- Progress indicator
- Error handling
- Image removal with confirmation

**Usage Example**:

```jsx
<ImageUpload
  onImagesChange={handleImagesChange}
  initialImages={existingImages}
  maxFiles={5}
  folder="products"
  disabled={loading}
/>
```

## Integration with Product Management

The Product Form now uses the ImageUpload component instead of manual URL input:

### Before (URL Input)

```jsx
<Input
  type="url"
  placeholder="https://example.com/image.jpg"
  value={imageUrl}
  onChange={handleUrlChange}
/>
```

### After (File Upload)

```jsx
<ImageUpload
  onImagesChange={handleImagesChange}
  initialImages={product?.images || []}
  maxFiles={10}
  folder="products"
/>
```

## File Organization

Images are organized in ImageKit with the following structure:

```
/products/
  ├── product-1-image.jpg
  ├── product-2-image.png
  └── ...
```

## File Validation

- **Supported formats**: JPEG, PNG, GIF, WebP
- **Maximum file size**: 10MB per file
- **Maximum files**: 10 per product (configurable)

## Error Handling

The upload component handles various error scenarios:

- Invalid file types
- File size too large
- Network errors
- ImageKit API errors
- Authentication failures

## Benefits

1. **Better User Experience**: Drag-and-drop interface is more intuitive
2. **File Management**: Centralized storage and management through ImageKit
3. **Performance**: Automatic image optimization and CDN delivery
4. **Security**: Server-side validation and secure upload process
5. **Scalability**: ImageKit handles image processing and transformations

## Migration Notes

- Existing products with URL-based images continue to work
- New products use ImageKit uploads
- Images are stored with `fileId` for deletion tracking
- Alt text and primary image settings are preserved

## Testing

1. Navigate to `/admin/products`
2. Click "Add Product"
3. In the images section, drag and drop image files
4. Verify upload progress and preview
5. Test image removal
6. Save product and verify images are properly stored

## Troubleshooting

### Upload Fails

- Check ImageKit credentials in environment variables
- Verify file size is under 10MB
- Ensure file is a supported image format

### Images Not Loading

- Check ImageKit URL endpoint configuration
- Verify network connectivity
- Check browser console for errors

### Permission Errors

- Verify ImageKit private key is correct
- Check API endpoint accessibility

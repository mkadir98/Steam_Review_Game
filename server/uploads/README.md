# Uploads Directory

This directory stores uploaded review screenshot images.

## Structure

- `reviews/` - Contains Steam review screenshot images uploaded through the admin panel

## File Naming

Files are automatically named with the pattern: `review-{timestamp}-{random}.{ext}`

Example: `review-1729867234567-123456789.png`

## Supported Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

## File Size Limit

Maximum file size: 5MB per image

## Security

- Only authenticated admin users can upload images
- File types are validated on upload
- Files are served as static assets via Express


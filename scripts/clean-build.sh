#!/bin/bash

# Clean build script to prevent secrets scanning issues
echo "Starting clean build process..."

# Remove any existing build artifacts
rm -rf .next
rm -rf .netlify

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the application
echo "Building application..."
npm run build

# Clean up webpack cache files that might contain API keys
echo "Cleaning webpack cache..."
find .next -name "*.pack" -type f -delete 2>/dev/null || true
find .next -name "webpack" -type d -exec rm -rf {} + 2>/dev/null || true

echo "Build process completed successfully!"

#!/bin/bash

# Script to deploy with image fixes applied
# This script ensures images are properly handled during deployment

echo "Deploying with image fixes..."

# Run the image fixes first
./scripts/commit-image-fixes.sh

# Build the project
echo "Building project..."
npm run build

# Deploy to Netlify (or other platform)
echo "Deploying to platform..."
# Add your deployment commands here
# Example: netlify deploy --prod

echo "Deployment with image fixes completed."

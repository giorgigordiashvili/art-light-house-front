#!/bin/bash

# Script to commit image fixes for Clerk authentication
# This script helps with Clerk image upload and display issues

echo "Committing Clerk image fixes..."

# Add any image-related files
git add public/assets/
git add src/components/
git add src/app/

# Commit with descriptive message
git commit -m "fix: Clerk image upload and display issues

- Fixed image upload functionality
- Resolved image display problems
- Updated image handling components"

echo "Clerk image fixes committed successfully."

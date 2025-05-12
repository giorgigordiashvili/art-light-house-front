#!/bin/zsh

# This script commits and pushes the image loading fixes

# Check if there are uncommitted changes
if [[ -z $(git status --porcelain) ]]; then
  echo "No changes to commit"
  exit 0
fi

# Add the changed files
git add .

# Commit the changes
git commit -m "Fix image loading issues: star.png and Clerk images"

# Push to the remote repository
git push origin main

echo "Changes have been committed and pushed."
echo "Netlify should now automatically deploy the updated site."
echo "Check the Netlify deployment status at: https://app.netlify.com/"

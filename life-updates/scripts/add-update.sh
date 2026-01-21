#!/bin/bash
# add-update.sh - Add a new life update from Android via Termux
#
# Setup:
# 1. pkg install termux-api imagemagick jq git
# 2. Install Termux:API and Termux:Widget from GitHub releases
# 3. Copy this script to ~/.shortcuts/tasks/
# 4. Long-press home screen → Widgets → Termux:Widget

# ===== CONFIGURATION =====
REPO_DIR="$HOME/Madhav-Malhotra.github.io"
IMAGES_DIR="$REPO_DIR/life-updates/images"
POSTS_FILE="$REPO_DIR/life-updates/data/posts.json"
TEMP_PHOTO="$HOME/temp_photo.jpg"
MAX_WIDTH=1200
QUALITY=80

# ===== HELPER FUNCTIONS =====
notify() {
    termux-toast "$1"
}

error_exit() {
    termux-toast "Error: $1"
    termux-vibrate -d 200
    rm -f "$TEMP_PHOTO"
    exit 1
}

# ===== MAIN SCRIPT =====

# Check if repo exists
if [ ! -d "$REPO_DIR" ]; then
    error_exit "Repo not found at $REPO_DIR"
fi

# Pull latest changes first
cd "$REPO_DIR" || error_exit "Cannot cd to repo"
notify "Pulling latest changes..."
git pull --rebase || error_exit "Git pull failed"

# Generate filename with timestamp
TIMESTAMP=$(date +%Y-%m-%d)
FILENAME="update-$(date +%Y%m%d-%H%M%S).jpg"
DEST_PATH="$IMAGES_DIR/$FILENAME"

# Ensure images directory exists
mkdir -p "$IMAGES_DIR"

# Remove any old temp photo first
rm -f "$TEMP_PHOTO"

# Open photo picker - termux-storage-get copies the selected file to the specified path
notify "Select a photo..."
termux-storage-get "$TEMP_PHOTO"

# Wait for file to appear (up to 1 minute)
WAIT_TIME=0
MAX_WAIT=60
while [ ! -f "$TEMP_PHOTO" ] && [ $WAIT_TIME -lt $MAX_WAIT ]; do
    sleep 1
    WAIT_TIME=$((WAIT_TIME + 1))
done

if [ ! -f "$TEMP_PHOTO" ]; then
    error_exit "No photo selected (timed out)"
fi

notify "Photo selected!"

# Resize and compress image
notify "Processing image..."
magick "$TEMP_PHOTO" -auto-orient -resize "${MAX_WIDTH}>" -quality "$QUALITY" "$DEST_PATH"

# Clean up temp file
rm -f "$TEMP_PHOTO"

if [ ! -f "$DEST_PATH" ]; then
    error_exit "Image processing failed"
fi

# Get file size for confirmation
SIZE=$(du -h "$DEST_PATH" | cut -f1)
notify "Image saved (${SIZE})"

# Get caption
CAPTION=$(termux-dialog text -t "Caption" -i "What's happening in this photo?" | jq -r '.text')

if [ -z "$CAPTION" ] || [ "$CAPTION" = "null" ]; then
    error_exit "No caption entered"
fi

# Get location
LOCATION=$(termux-dialog text -t "Location" -i "Where was this taken?" | jq -r '.text')

if [ -z "$LOCATION" ] || [ "$LOCATION" = "null" ]; then
    error_exit "No location entered"
fi

# Update posts.json - prepend new post to array
notify "Updating posts.json..."

jq --arg img "/life-updates/images/$FILENAME" \
   --arg cap "$CAPTION" \
   --arg loc "$LOCATION" \
   --arg ts "$TIMESTAMP" \
   '[{"image": $img, "caption": $cap, "location": $loc, "timestamp": $ts}] + .' \
   "$POSTS_FILE" > "$POSTS_FILE.tmp"

if ! mv "$POSTS_FILE.tmp" "$POSTS_FILE"; then
    rm -f "$POSTS_FILE.tmp"
    error_exit "Failed to update posts.json"
fi

# Commit and push
notify "Committing to git..."
cd "$REPO_DIR" || error_exit "Cannot cd to repo"
git add life-updates/
git commit -m "Life update: $LOCATION - $TIMESTAMP"

notify "Pushing to GitHub..."
if git push; then
    termux-vibrate -d 100
    termux-toast "Posted!"
else
    error_exit "Push failed - commit saved locally"
fi

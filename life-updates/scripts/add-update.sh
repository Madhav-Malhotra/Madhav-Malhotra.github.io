#!/bin/bash
# add-update.sh - Add a new life update from Android via Termux
#
# Setup:
# 1. pkg install termux-api imagemagick jq git
# 2. Install Termux:API and Termux:Widget from F-Droid
# 3. Copy this script to ~/.shortcuts/
# 4. Long-press home screen → Widgets → Termux:Widget

# ===== CONFIGURATION =====
REPO_DIR="$HOME/madhav-malhotra.github.io"
IMAGES_DIR="$REPO_DIR/life-updates/images"
POSTS_FILE="$REPO_DIR/life-updates/data/posts.json"
MAX_WIDTH=1200
QUALITY=80

# ===== HELPER FUNCTIONS =====
notify() {
    termux-toast "$1"
}

error_exit() {
    termux-toast "Error: $1"
    termux-vibrate -d 200
    exit 1
}

# ===== MAIN SCRIPT =====

# Check if repo exists
if [ ! -d "$REPO_DIR" ]; then
    error_exit "Repo not found at $REPO_DIR"
fi

# Pull latest changes first
cd "$REPO_DIR"
notify "Pulling latest changes..."
git pull --rebase || error_exit "Git pull failed"

# Open photo picker
notify "Select a photo..."
PHOTO=$(termux-storage-get)

if [ -z "$PHOTO" ] || [ ! -f "$PHOTO" ]; then
    error_exit "No photo selected"
fi

notify "Photo selected!"

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

# Generate filename with timestamp
TIMESTAMP=$(date +%Y-%m-%d)
FILENAME="update-$(date +%Y%m%d-%H%M%S).jpg"
DEST_PATH="$IMAGES_DIR/$FILENAME"

# Ensure images directory exists
mkdir -p "$IMAGES_DIR"

# Resize and compress image
notify "Processing image..."
convert "$PHOTO" -auto-orient -resize "${MAX_WIDTH}>" -quality "$QUALITY" "$DEST_PATH"

if [ ! -f "$DEST_PATH" ]; then
    error_exit "Image processing failed"
fi

# Get file size for confirmation
SIZE=$(du -h "$DEST_PATH" | cut -f1)
notify "Image saved (${SIZE})"

# Update posts.json - prepend new post to array
notify "Updating posts.json..."

# Escape special characters in caption for JSON
CAPTION_ESCAPED=$(echo "$CAPTION" | sed 's/\\/\\\\/g; s/"/\\"/g; s/\t/\\t/g')
LOCATION_ESCAPED=$(echo "$LOCATION" | sed 's/\\/\\\\/g; s/"/\\"/g; s/\t/\\t/g')

jq --arg img "/life-updates/images/$FILENAME" \
   --arg cap "$CAPTION_ESCAPED" \
   --arg loc "$LOCATION_ESCAPED" \
   --arg ts "$TIMESTAMP" \
   '[{"image": $img, "caption": $cap, "location": $loc, "timestamp": $ts}] + .' \
   "$POSTS_FILE" > "$POSTS_FILE.tmp"

if [ $? -ne 0 ]; then
    rm -f "$POSTS_FILE.tmp"
    error_exit "Failed to update posts.json"
fi

mv "$POSTS_FILE.tmp" "$POSTS_FILE"

# Commit and push
notify "Committing to git..."
cd "$REPO_DIR"
git add life-updates/
git commit -m "Life update: $LOCATION - $TIMESTAMP"

notify "Pushing to GitHub..."
git push

if [ $? -eq 0 ]; then
    termux-vibrate -d 100
    termux-toast "Posted! 🎉"
else
    error_exit "Push failed - commit saved locally"
fi

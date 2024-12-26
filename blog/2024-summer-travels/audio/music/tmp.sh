#!/bin/bash

# Define the base path to prepend
BASE_PATH="/blog/2024-summer-travels/audio/music"

# Start the JSON output
echo "{"

# Find all MP3 files in the directory (recursive) and process them
find . -type f -name "*.mp3" | while read -r file; do
  # Extract the base filename
  base_name=$(basename "$file")
  
  # Print the formatted JSON line
  echo "  \"$BASE_PATH/$base_name\": null,"
done | sed '$ s/,$//' # Remove the trailing comma from the last line

# End the JSON output
echo "}"


#!/bin/bash

# Check if a folder path is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <folder-path>"
    exit 1
fi

# Assign the input folder path
FOLDER="$1"
PROCESSED_FOLDER="${FOLDER}/processed"

# Check if the folder exists
if [ ! -d "$FOLDER" ]; then
    echo "Error: The folder '$FOLDER' does not exist."
    exit 1
fi

# Create the processed folder if it doesn't exist
mkdir -p "$PROCESSED_FOLDER"

# Process each MP3 file in the folder
for file in "$FOLDER"/*.mp3; do
    if [ -f "$file" ]; then
        # Extract the file name
        filename=$(basename "$file")
        output_file="${PROCESSED_FOLDER}/${filename}"

        # Decrease volume by 2dB using ffmpeg
        ffmpeg -i "$file" -filter:a "volume=4dB" "$output_file"

        # Check if the processing was successful
        if [ $? -eq 0 ]; then
            echo "Processed: $file -> $output_file"
        else
            echo "Failed to process: $file"
        fi
    fi
done

echo "Processing complete! Processed files are in '$PROCESSED_FOLDER'."
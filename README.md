# Web Scraping Script for Image Metadata

This repository contains a JavaScript script for scraping image metadata. The script is designed to be run in the browser's console and captures various attributes like the image URL, prompt, user, and parameters. It also checks if an image prompt is present.

## How to Use

1. Navigate to the webpage where the images are displayed (Midjourney Community Showcase). Click on the first image to display its details (requires paid Midjourney subscription). 
2. Open the web browser's developer console.
3. Copy-paste the script from `script.js` into the console and run it.

The script will automatically go through the first 30 images on the page and collect their metadata.

## Output

The output is displayed in a textarea on the webpage. You can copy this JSON formatted data to the clipboard by clicking the "Copy Data" button. To clear the textarea for a new batch, click the "Clear Data" button.

## Script Features

- Automatically navigates through images
- Collects various types of metadata
- Identifies if an image prompt is present
- Easy to copy the output
- Simple way to clear the output for the next batch

## Note

This is a personal project and should not be used to violate any rules or terms of service on the website you are scraping.

## License

MIT License

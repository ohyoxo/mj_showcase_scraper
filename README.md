# Asynchronous Web Scraping Script for Image and Prompt Data

This repository contains an enhanced JavaScript script designed for asynchronous scraping of image and prompt data from a web page. The script is executed in the browser's console and captures attributes such as the image URL and the associated prompt text.

## How to Use

1. Navigate to the webpage where the images are displayed. Open the image that you wish to begin scraping data from.
2. Access the web browser's developer console.
3. Copy-paste the script from `script.js` into the console and execute it.

The script will automatically scrape the data for 30 images, starting from the one you initially opened.

## Output

The collected data is displayed in a fixed textarea at the top-left corner of the webpage. The output is in JSON format, now with trailing commas for ease of appending to continuous files.

### Controls

- **Copy**: Clicking the "Copy" button copies the entire JSON data to your clipboard.
- **Clear**: Clicking the "Clear" button will clear the textarea.

## Script Features

- Asynchronous data extraction
- Auto-navigation through images
- Improved formatting in the output, including trailing commas
- Quick actions for copying and clearing data

## Note

This is a personal project and should be used responsibly, adhering to any rules or terms of service on the website you are scraping.

## License

MIT License

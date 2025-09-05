# Asynchronous Web Scraping Script for Image and Prompt Data

<<<<<<< HEAD
This repository contains two JavaScript snippets for asynchronous scraping of image and prompt data:

- **Midjourney** Community Showcase
- **Sora** [explore page](https://sora.chatgpt.com/explore)

Each script is executed in the browser's console and captures attributes such as the image or video thumbnail URL and the associated prompt text.

## How to Use

### Midjourney
1. Open the first showcase item you want and ensure the modal is visible.
=======
This repository contains an enhanced JavaScript script designed for asynchronous scraping of image and prompt data from Midjourney's Community Showcase as well as prompts and thumbnails from OpenAI's [Sora](https://sora.chatgpt.com/explore) explore page. The script is executed in the browser's console and captures attributes such as the image or video thumbnail URL and the associated prompt text.

## How to Use

1. Navigate to the page you would like to scrape.
   - **Midjourney**: open the first showcase item you want and ensure the modal is visible.
   - **Sora**: open the [explore page](https://sora.chatgpt.com/explore) and load the items you want to collect.
>>>>>>> main
2. Access the web browser's developer console.
3. Copy-paste the contents of `midjourney.js` into the console and execute it.

For Midjourney, the script will automatically scrape the data for 30 images, starting from the one you initially opened. On Sora, it will gather the prompts and thumbnails for all explore cards currently loaded on the page.

### Sora
1. Open the [explore page](https://sora.chatgpt.com/explore) and click the first item you want to capture so that its detail view is open.
2. Access the web browser's developer console.
3. Copy-paste the contents of `sora.js` into the console and execute it.

The script will scrape the current card and then automatically click the "next" preview to capture the URL, user, and prompt for subsequent items.

## Output

The collected data is displayed in a fixed textarea at the top-left corner of the webpage. The output is in JSON format, now with trailing commas for ease of appending to continuous files.

### Controls

- **Copy**: Clicking the "Copy" button copies the entire JSON data to your clipboard.
- **Clear**: Clicking the "Clear" button will clear the textarea.

## Script Features

- Asynchronous data extraction
- Auto-navigation through images (Midjourney & Sora)
- Improved formatting in the output, including trailing commas
- Quick actions for copying and clearing data

## Testing

<<<<<<< HEAD
Run `npm test` to perform a syntax check of both scripts.
=======
Run `npm test` to perform a syntax check of `script.js`.
>>>>>>> main

## Note

This is a personal project and should be used responsibly, adhering to any rules or terms of service on the website you are scraping.

## License

MIT License

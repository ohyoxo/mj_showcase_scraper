function extractSoraData() {
  // Select the main image or video poster in the viewer
  const media = document.querySelector(
    'div.relative.w-\\[70\\%\\] img[alt="Generated image"], div.relative.w-\\[70\\%\\] video'
  );
  let url = 'N/A';
  if (media) {
    url = media.tagName === 'VIDEO' ? media.poster || media.src : media.src;
  }

  // Find the "Prompt" label and get the text from the next element
  const promptLabel = Array.from(document.querySelectorAll('div')).find(
    (el) => el.textContent.trim() === 'Prompt'
  );
  const prompt =
    promptLabel?.nextElementSibling?.textContent?.trim() || 'N/A';

  // Find the user's name by looking for a link that contains "?user=" in its href
  const userEl = document.querySelector('a[href*="?user="]');
  const user = userEl?.textContent?.trim() || 'N/A';

  return { url, user, prompt };
}

async function clickNextImage(previousUrl) {
  // Select the right-side container (which holds the next image) using a more robust selector
  const container = document.querySelector(
    '.flex.flex-1.cursor-pointer > div:last-child'
  );
  const nextLink = container?.querySelector('a');

  if (!nextLink) {
    console.log('Next link not found.');
    return false;
  }
  nextLink.click();

  // Wait for the new image/video to load by polling
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 250)); // Wait for 250ms
    const media = document.querySelector(
      'div.relative.w-\\[70\\%\\] img[alt="Generated image"], div.relative.w-\\[70\\%\\] video'
    );
    if (media) {
      const currentUrl =
        media.tagName === 'VIDEO' ? media.poster || media.src : media.src;
      // If the URL has changed, we have successfully moved to the next item
      if (currentUrl && currentUrl !== previousUrl) {
        return true;
      }
    }
  }

  console.log('Failed to load the next image in time.');
  return false; // Return false if the next image didn't load within 5 seconds
}

function displayData(data) {
  // Create a UI to show and copy the scraped data
  const existingTextarea = document.getElementById('sora-scraper-textarea');
  if (existingTextarea) {
    document.body.removeChild(existingTextarea.nextSibling); // remove copy button
    document.body.removeChild(existingTextarea.nextSibling); // remove clear button
    document.body.removeChild(existingTextarea);
  }

  const textarea = document.createElement('textarea');
  textarea.id = 'sora-scraper-textarea';
  const copyButton = document.createElement('button');
  const clearButton = document.createElement('button');

  textarea.style.zIndex = '10000';
  textarea.style.position = 'fixed';
  textarea.style.top = '20px';
  textarea.style.left = '20px';
  textarea.style.width = '350px';
  textarea.style.height = '200px';
  textarea.style.backgroundColor = '#222';
  textarea.style.color = '#eee';
  textarea.style.border = '1px solid #555';
  textarea.style.borderRadius = '8px';
  textarea.style.padding = '10px';

  textarea.value =
    '[\n' + data.map((d) => JSON.stringify(d, null, 2)).join(',\n') + '\n]';

  copyButton.innerHTML = '📋 Copy JSON';
  copyButton.style.zIndex = '10001';
  copyButton.style.position = 'fixed';
  copyButton.style.top = '230px';
  copyButton.style.left = '20px';
  copyButton.style.cursor = 'pointer';

  clearButton.innerHTML = '🗑️ Clear';
  clearButton.style.zIndex = '10001';
  clearButton.style.position = 'fixed';
  clearButton.style.top = '230px';
  clearButton.style.left = '130px';
  clearButton.style.cursor = 'pointer';

  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(textarea.value).then(() => {
      copyButton.innerHTML = '✅ Copied!';
      setTimeout(() => {
        copyButton.innerHTML = '📋 Copy JSON';
      }, 2000);
    });
  });

  clearButton.addEventListener('click', () => {
    textarea.value = '';
    results.length = 0;
  });

  document.body.appendChild(textarea);
  document.body.appendChild(copyButton);
  document.body.appendChild(clearButton);
}

// Main execution function
const results = [];
(async function main() {
  // You can change the number of images to scrape here
  const imagesToScrape = 30;

  for (let i = 0; i < imagesToScrape; i++) {
    console.log(`Scraping image ${i + 1}/${imagesToScrape}...`);
    const data = extractSoraData();
    if (data.url === 'N/A' || results.some((r) => r.url === data.url)) {
      console.log('No new data found or duplicate detected. Stopping.');
      break;
    }
    results.push(data);

    const moved = await clickNextImage(data.url);
    if (!moved) {
      console.log('Could not move to the next image. Stopping scrape.');
      break;
    }
  }

  console.log('Scraping complete. Displaying data.');
  displayData(results);
})();


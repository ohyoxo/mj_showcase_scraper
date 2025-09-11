/**
 * Waits for the main media element's URL to change from the supplied old URL.
 * This is used to confirm that a navigation (forward or back) has completed.
 *
 * @param {string} oldUrl - The media URL we expect to change away from.
 * @param {number} timeout - Maximum time to wait in milliseconds.
 * @returns {Promise<boolean>} True if the URL changed, false if it timed out.
 */
async function waitForNewUrl(oldUrl, timeout = 10000) {
  const pollingInterval = 250;
  const maxAttempts = timeout / pollingInterval;
  for (let i = 0; i < maxAttempts; i++) {
    const media = document.querySelector('div.relative.w-\\[70\\%\\] img[alt="Generated image"], div.relative.w-\\[70\\%\\] video');
    if (media) {
      const currentUrl = media.tagName === 'VIDEO' ? media.poster || media.src : media.src;
      if (currentUrl && currentUrl !== oldUrl) {
        console.log('Navigation complete.');
        await new Promise(r => setTimeout(r, 500));
        return true;
      }
    }
    await new Promise(r => setTimeout(r, pollingInterval));
  }
  console.log('Timeout waiting for page navigation.');
  return false;
}

function extractSoraData() {
  // --- Basic Info ---
  const media = document.querySelector('div.relative.w-\\[70\\%\\] img[alt="Generated image"], div.relative.w-\\[70\\%\\] video');
  const url = media ? (media.tagName === 'VIDEO' ? media.poster || media.src : media.src) : 'N/A';

  // --- User Info ---
  const userEl = document.querySelector('a[href*="?user="]');
  const user = userEl?.textContent?.trim() || 'N/A';
  const userUrl = userEl ? new URL(userEl.href, window.location.origin).href : 'N/A';

  // --- Likes Info ---
  const likeSvgPath = 'M12 5.822c6.504-6.44 17.654 5.52 0 15.178C-5.654 11.342 5.496-.618 12 5.822Z';
  const likeButton = document.querySelector(`svg path[d="${likeSvgPath}"]`)?.closest('button');
  const likesText = likeButton?.querySelector('div.text-center')?.textContent.trim();
  const likes = likesText ? parseInt(likesText.replace(/,/g, ''), 10) || 0 : 0;

  // --- Prompt / Remix Info ---
  let prompt = 'N/A';
  let isRemix = false;
  let remixParentUrl = null;

  // Use a specific container to find the prompt details.
  const promptDetailsContainer = document.querySelector('div[style="height: 60px;"]');
  if (promptDetailsContainer) {
    const labelEl = promptDetailsContainer.querySelector('div.text-token-text-secondary');
    const promptButton = promptDetailsContainer.querySelector('button.truncate');

    if (labelEl && promptButton) {
      prompt = promptButton.textContent.trim();
      if (labelEl.textContent.trim() === 'Remix') {
        isRemix = true;
        const parentImageLink = promptDetailsContainer.querySelector('div.relative.h-8.w-8 a');
        if (parentImageLink) {
          remixParentUrl = new URL(parentImageLink.href, window.location.origin).href;
        }
      }
    }
  }

  return { url, user, userUrl, likes, prompt, isRemix, remixParentUrl, remixParentPrompt: null };
}

async function clickNextImage(previousUrl) {
  let container = document.querySelector('.flex.flex-1.cursor-pointer > div:last-child');
  let nextLink = container?.querySelector('a');

  if (!nextLink) {
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`Next link not found. Attempting to load more (Attempt ${attempt}/${maxRetries})...`);
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise(r => setTimeout(r, 3000)); 
      
      container = document.querySelector('.flex.flex-1.cursor-pointer > div:last-child');
      nextLink = container?.querySelector('a');

      if (nextLink) {
        console.log('Successfully loaded more images.');
        break;
      }
    }
  }

  if (!nextLink) {
    console.log('Still no next link after multiple attempts. Assuming end of gallery.');
    return false;
  }

  nextLink.click();
  return await waitForNewUrl(previousUrl);
}

function displayData(data) {
  const existingContainer = document.getElementById('sora-scraper-container');
  if (existingContainer) {
    document.body.removeChild(existingContainer);
  }

  const container = document.createElement('div');
  container.id = 'sora-scraper-container';
  container.style.zIndex = '10000';
  container.style.position = 'fixed';
  container.style.top = '20px';
  container.style.left = '20px';
  container.style.fontFamily = 'monospace';
  container.style.backgroundColor = 'rgba(40, 40, 40, 0.95)';
  container.style.padding = '15px';
  container.style.borderRadius = '10px';
  container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
  container.style.pointerEvents = 'auto';

  const textarea = document.createElement('textarea');
  const copyButton = document.createElement('button');
  const clearButton = document.createElement('button');
  
  textarea.style.width = '350px';
  textarea.style.height = '200px';
  textarea.style.backgroundColor = '#222';
  textarea.style.color = '#eee';
  textarea.style.border = '1px solid #555';
  textarea.style.borderRadius = '8px';
  textarea.style.padding = '10px';
  textarea.style.display = 'block';

  textarea.value = '[\n' + data.map((d) => JSON.stringify(d, null, 2)).join(',\n') + '\n]';
  
  const buttonContainer = document.createElement('div');
  buttonContainer.style.marginTop = '8px';

  copyButton.innerHTML = '📋 Copy JSON';
  clearButton.innerHTML = '🗑️ Clear';
  [copyButton, clearButton].forEach(btn => {
    btn.style.cursor = 'pointer';
    btn.style.marginRight = '8px';
    btn.style.padding = '5px 10px';
    btn.style.border = '1px solid #555';
    btn.style.borderRadius = '5px';
    btn.style.backgroundColor = '#333';
    btn.style.color = '#eee';
  });

  copyButton.addEventListener('click', (event) => {
    event.stopPropagation();
    navigator.clipboard.writeText(textarea.value).then(() => {
      copyButton.innerHTML = '✅ Copied!';
      setTimeout(() => { copyButton.innerHTML = '📋 Copy JSON'; }, 2000);
    });
  });

  clearButton.addEventListener('click', (event) => {
    event.stopPropagation();
    textarea.value = '[]';
    results.length = 0;
  });
  
  buttonContainer.appendChild(copyButton);
  buttonContainer.appendChild(clearButton);
  container.appendChild(textarea);
  container.appendChild(buttonContainer);
  document.body.appendChild(container);
}

// --- Main execution function ---
const results = [];

(async function main() {
  const TARGET_IMAGE_COUNT = 100;

  while (results.length < TARGET_IMAGE_COUNT) {
    console.log(`Scraping image ${results.length + 1}/${TARGET_IMAGE_COUNT}...`);
    
    await new Promise(r => setTimeout(r, 200)); 

    const data = extractSoraData();
    
    if (data.url === 'N/A') {
      console.log('Could not extract data from the current view. Retrying...');
      await new Promise(r => setTimeout(r, 1000));
      continue;
    }
    
    if (results.some((r) => r.url === data.url)) {
      console.log('Duplicate image detected. Trying to click next again.');
      const movedAgain = await clickNextImage(data.url);
      if(!movedAgain){
        break;
      }
      continue;
    }

    // Traverse to remix parent to capture its prompt if available
    if (data.isRemix && data.remixParentUrl) {
      console.log(`Found a remix. Traversing to parent: ${data.remixParentUrl}`);
      const parentLinkEl = document.querySelector('div[style="height: 60px;"] div.relative.h-8.w-8 a');
      if (parentLinkEl) {
        parentLinkEl.click();
        if (await waitForNewUrl(data.url)) {
          const parentData = extractSoraData();
          data.remixParentPrompt = parentData.prompt;
          console.log(`Parent prompt captured: "${data.remixParentPrompt}"`);
          const parentMediaUrl = parentData.url;
          history.back();
          await waitForNewUrl(parentMediaUrl);
        }
      }
    }

    results.push(data);
    displayData(results);

    const moved = await clickNextImage(data.url);
    if (!moved) {
      console.log('Scraping stopped.');
      break;
    }
  }

  console.log(`Scraping finished. Collected ${results.length} items.`);
  displayData(results);
})();


// Extract a single item's data from the Midjourney showcase modal
async function extractMidjourneyData() {
  const imgElement = document.querySelector('img.modalImage');
  const promptElement = document.querySelector('#modalPrompt');
  const paramsElement = document.querySelector('code');

  let url = imgElement ? imgElement.src : 'N/A';
  let prompt = promptElement ? promptElement.innerText : 'N/A';
  let params = paramsElement ? paramsElement.innerText : 'N/A';

  if (params === 'No arguments') params = '';

  prompt = prompt.replace(/\n+/g, ' ').trim();
  if (params !== '') {
    prompt = `${prompt} ${params}`;
  }

  return {
    url,
    prompt
  };
}

function clickNextButton() {
  return new Promise(resolve => {
    const button = document.querySelector('button[title="Next"]');
    if (button) button.click();
    setTimeout(resolve, 250);
  });
}

function displayData(data) {
  const textarea = document.createElement('textarea');
  const copyButton = document.createElement('button');
  const clearButton = document.createElement('button');

  textarea.style.zIndex = "10000";
  textarea.style.position = "fixed";
  textarea.style.top = "20px";
  textarea.style.left = "20px";
  textarea.style.width = "300px";
  textarea.style.height = "150px";

  textarea.value = data.map(d => JSON.stringify(d, null, 2)).join(',\n') + ',\n';

  copyButton.innerHTML = 'Copy';
  copyButton.style.zIndex = "10001";
  copyButton.style.position = "fixed";
  copyButton.style.top = "180px";
  copyButton.style.left = "20px";

  clearButton.innerHTML = 'Clear';
  clearButton.style.zIndex = "10001";
  clearButton.style.position = "fixed";
  clearButton.style.top = "180px";
  clearButton.style.left = "80px";

  copyButton.addEventListener('click', () => {
    textarea.select();
    document.execCommand('copy');
  });

  clearButton.addEventListener('click', () => {
    textarea.value = '';
  });

  document.body.appendChild(textarea);
  document.body.appendChild(copyButton);
  document.body.appendChild(clearButton);
}

(async function main() {
  const allData = [];
  for (let i = 0; i < 30; i++) {
    const data = await extractMidjourneyData();
    allData.push(data);
    await clickNextButton();
  }
  displayData(allData);
})();

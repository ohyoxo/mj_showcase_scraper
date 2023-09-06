function extractDataFromCurrentImage() {
    const image = document.querySelector('img.modalImage');
    const userElement = document.querySelector('p.ml-4');
    const parametersElement = document.querySelector('div.miniScrollbar');
    const imagePromptElement = document.querySelector('div.miniScrollbar > div.grid');

    const parameters = parametersElement ? parametersElement.innerText : 'N/A';
    const parsedParameters = parameters
        .split('--')
        .filter(Boolean)
        .map(param => {
            const [key, value] = param.trim().split(' ');
            return { [key]: value || true };
        });
    
    const currentData = {
        imageUrl: image.src,
        prompt: image.alt,
        user: userElement ? userElement.innerText : 'N/A',
        parameters: parsedParameters
    };

    if (imagePromptElement) {
        currentData.imagePrompt = 'yes';
    }

    return currentData;
}

function waitForImageChange(currentImageUrl) {
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            const newImageUrl = document.querySelector('img.modalImage').src;
            if (newImageUrl !== currentImageUrl) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 500);
    });
}

function navigateToNextImage() {
    const currentImageUrl = document.querySelector('img.modalImage').src;
    const nextArrow = document.querySelector('#jobPage > button.hidden.fixed.top-1\\/2.right-10.z-50.justify-center.items-center.w-14.h-14.text-\\[\\#D6DDF0\\].hover\\:bg-darkBlue-500\\/80.active\\:bg-uiBlue-500\\/60.rounded-full.outline-2.active\\:outline-\\[\\#7898D7\\].active\\:outline.outline-offset-2.disabled\\:opacity-0.transition-colors.-translate-y-1\\/2.lg\\:flex');
    nextArrow.click();
    return waitForImageChange(currentImageUrl);
}

function displayData(data) {
    const textarea = document.createElement('textarea');
    const copyButton = document.createElement('button');
    const clearButton = document.createElement('button');

    // Textarea setup
    textarea.style.width = '80%';
    textarea.style.height = '200px';
    textarea.style.position = 'fixed';
    textarea.style.top = '10%';
    textarea.style.left = '10%';
    textarea.style.zIndex = '9999';
    textarea.innerText = JSON.stringify(data, null, 2);

    // Copy Button setup
    copyButton.innerText = 'Copy Data';
    copyButton.style.position = 'fixed';
    copyButton.style.top = '5%';
    copyButton.style.left = '10%';
    copyButton.style.zIndex = '10000';
    copyButton.onclick = function() {
        textarea.select();
        document.execCommand('copy');
        alert('Data copied to clipboard!');
    };

    // Clear Button setup
    clearButton.innerText = 'Clear Data';
    clearButton.style.position = 'fixed';
    clearButton.style.top = '5%';
    clearButton.style.left = '20%';
    clearButton.style.zIndex = '10000';
    clearButton.onclick = function() {
        textarea.innerText = '';
    };

    document.body.appendChild(textarea);
    document.body.appendChild(copyButton);
    document.body.appendChild(clearButton);
}

async function scrapeImages() {
    const data = [];
    const numberOfImages = 30; // Adjust as needed

    for (let i = 0; i < numberOfImages; i++) {
        const currentImageData = extractDataFromCurrentImage();
        data.push(currentImageData);
        if (i < numberOfImages - 1) {
            await navigateToNextImage();
        }
    }

    displayData(data);
}

scrapeImages();

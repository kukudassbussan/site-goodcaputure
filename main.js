const urlInput = document.getElementById('url-input');
const scrapeBtn = document.getElementById('scrape-btn');
const statusArea = document.getElementById('status-area');

scrapeBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) {
        statusArea.textContent = 'Please enter a URL to scrape.';
        return;
    }

    statusArea.textContent = 'Scraping... please wait.';

    // Using a more reliable public CORS proxy
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const html = data.contents;

        if (!html) {
            throw new Error('Could not fetch the page content.');
        }
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Attempt to get a meaningful title
        const title = doc.querySelector('h1')?.innerText || doc.title || new URL(url).hostname;

        // Use Readability to extract the main content
        const reader = new Readability(doc);
        const article = reader.parse();
        const content = article ? article.textContent : doc.body.innerText;

        if (!content) {
            throw new Error('Could not extract any content.');
        }

        // Create and download the file
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);

        statusArea.textContent = 'Scraping and download complete!';
    } catch (error) {
        console.error('Scraping failed:', error);
        statusArea.textContent = `Failed to scrape content. ${error.message}`;
    }
});

const urlInput = document.getElementById('url-input');
const scrapeBtn = document.getElementById('scrape-btn');
const statusArea = document.getElementById('status-area');

const fetchViaProxy = async (url) => {
    const proxyUrl = `https://thingproxy.freeboard.io/fetch/${url}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    return html;
};

const scrapeDCInside = (html, doc) => {
    let content = '\n';

    // Get post content
    const postContent = doc.querySelector('.writing_view_box');
    if (postContent) {
        content += '--- Post Content ---\n';
        content += `${postContent.innerText.trim()}\n\n`;
    }

    // Get comments
    const commentBox = doc.querySelector('#comment_box');
    if (commentBox) {
        content += '--- Comments ---\n';
        const comments = commentBox.querySelectorAll('.ub-content');
        comments.forEach(comment => {
            const nickname = comment.querySelector('.nickname')?.innerText || '[unknown]';
            const commentText = comment.querySelector('.usertxt')?.innerText || '';
            if (commentText) {
                content += `[${nickname}]: ${commentText}\n`;
            }
        });
    }

    return content.trim();
};


scrapeBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) {
        statusArea.textContent = 'Please enter a URL to scrape.';
        return;
    }

    statusArea.textContent = 'Scraping... please wait.';

    try {
        const html = await fetchViaProxy(url);
        if (!html) {
            throw new Error('Could not fetch the page content.');
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        let content;
        let title;

        if (url.includes('gall.dcinside.com')) {
            title = doc.querySelector('.title_subject')?.innerText || new URL(url).hostname;
            content = scrapeDCInside(html, doc);
        } else {
            title = doc.querySelector('h1')?.innerText || doc.title || new URL(url).hostname;
            const reader = new Readability(doc);
            const article = reader.parse();
            content = article ? article.textContent : doc.body.innerText;
        }

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

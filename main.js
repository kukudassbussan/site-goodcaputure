class BookmarkCard extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const link = this.getAttribute('link');
        const title = this.getAttribute('title');

        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'bookmark-card');

        const style = document.createElement('style');
        style.textContent = `
            .bookmark-card {
                background-color: var(--card-background);
                border-radius: 8px;
                box-shadow: 0 4px 8px var(--shadow-color);
                padding: 1rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .bookmark-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 16px var(--shadow-color);
            }
            a {
                color: var(--primary-color);
                text-decoration: none;
                font-size: 1.2rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
                word-break: break-all;
            }
            .delete-btn {
                align-self: flex-end;
                background: #ff4d4d;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 0.5rem;
                cursor: pointer;
                font-size: 0.9rem;
            }
        `;

        const bookmarkLink = document.createElement('a');
        bookmarkLink.href = link;
        bookmarkLink.textContent = title || link;
        bookmarkLink.target = '_blank';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = () => {
            this.dispatchEvent(new CustomEvent('delete', { detail: { link } }));
        };

        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        wrapper.appendChild(bookmarkLink);
        wrapper.appendChild(deleteButton);
    }
}

customElements.define('bookmark-card', BookmarkCard);

// DOM Elements
const form = document.getElementById('bookmark-form');
const urlInput = document.getElementById('url-input');
const bookmarksContainer = document.getElementById('bookmarks-container');
const scrapeBtn = document.getElementById('scrape-btn');
const statusArea = document.getElementById('status-area');

// Bookmarks
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

const saveBookmarks = () => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
};

const renderBookmarks = () => {
    bookmarksContainer.innerHTML = '';
    bookmarks.forEach(bookmark => {
        const bookmarkCard = document.createElement('bookmark-card');
        bookmarkCard.setAttribute('link', bookmark.link);
        bookmarkCard.setAttribute('title', bookmark.title);
        bookmarkCard.addEventListener('delete', (e) => {
            bookmarks = bookmarks.filter(b => b.link !== e.detail.link);
            saveBookmarks();
            renderBookmarks();
        });
        bookmarksContainer.appendChild(bookmarkCard);
    });
};

// Event Listeners
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = urlInput.value.trim();
    if (url) {
        const newBookmark = { link: url, title: url };
        if (!bookmarks.some(b => b.link === url)) {
            bookmarks.push(newBookmark);
            saveBookmarks();
            renderBookmarks();
        }
        urlInput.value = '';
    }
});

scrapeBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) {
        statusArea.textContent = 'Please enter a URL to scrape.';
        return;
    }

    statusArea.textContent = 'Scraping... please wait.';

    // Using a public CORS proxy
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Attempt to get a meaningful title
        const title = doc.querySelector('h1')?.innerText || doc.title || url.split('/').slice(0,3).join('/');

        // Extract text content
        const reader = new readability.Readability(doc);
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


// Initial Render
renderBookmarks();

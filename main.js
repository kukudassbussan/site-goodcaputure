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

const form = document.getElementById('bookmark-form');
const urlInput = document.getElementById('url-input');
const bookmarksContainer = document.getElementById('bookmarks-container');

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

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = urlInput.value;
    if (url) {
        // For simplicity, we'll use the URL as the title for now.
        const newBookmark = { link: url, title: url };
        bookmarks.push(newBookmark);
        saveBookmarks();
        renderBookmarks();
        urlInput.value = '';
    }
});

// Initial render
renderBookmarks();

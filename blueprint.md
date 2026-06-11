# Project Blueprint: Web Content Scraper

## Overview

This project is a web-based tool that allows users to scrape the text content from a given URL for offline reading. The application provides a simple interface to enter a URL, fetch its content, and download it as a text file.

## Current Features

### Core Functionality (Complete)

1.  **HTML Structure:**
    *   Header with the application title.
    *   Form with an input field for a URL and a "Scrape & Download" button.
    *   A status area to provide feedback to the user.

2.  **CSS Styling:**
    *   Modern, responsive design with a visually appealing color scheme.
    *   Clean and simple layout.

3.  **JavaScript Logic:**
    *   Event listener for the "Scrape & Download" button.
    *   Uses a public CORS proxy (`thingproxy.freeboard.io`) to fetch the HTML content of the target URL, bypassing browser security policies.
    *   Parses the fetched HTML using the DOMParser and the Readability.js library to extract the main article content.
    *   Creates a `Blob` with the extracted text.
    *   Generates a download link for the text file and triggers the download automatically.
    *   Includes error handling and status updates for the user.

## DCInside Gallery Scraper

### Plan

1.  **Update UI:** No major UI changes are needed. The user will use the same input field.
2.  **Enhance Scraping Logic:**
    *   Detect if the URL is from `gall.dcinside.com`.
    *   If it is, use a custom scraping logic instead of `Readability.js`.
    *   **Post Content:** Identify and select the main post body element (`.writing_view_box`).
    *   **Comments:** Identify and select the comment list (`#comment_box`). Iterate through each comment to extract the author (`.nickname`) and text (`.usertxt`).
    *   Combine the post content and all comments into a single, formatted text string.
3.  **Update File Output:** The downloaded file will contain the formatted post and comments.
4.  **Testing:** Verify the feature works with the provided DCInside URL.

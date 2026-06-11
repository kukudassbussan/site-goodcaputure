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
    *   Uses a public CORS proxy (`allorigins.win`) to fetch the HTML content of the target URL, bypassing browser security policies.
    *   Parses the fetched HTML using the DOMParser and the Readability.js library to extract the main article content.
    *   Creates a `Blob` with the extracted text.
    *   Generates a download link for the text file and triggers the download automatically.
    *   Includes error handling and status updates for the user.

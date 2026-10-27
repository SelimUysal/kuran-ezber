# Quran Memorization & Arabic Text Analysis

An interactive web application for Quran reading, memorization practice, Arabic text selection, adjustable audio playback, and optional AI-assisted linguistic analysis.

**[Live demo](https://selimuysal.github.io/kuran-ezber/)**

## Features

- **Interactive text selection:** Select individual words or word ranges, with Shift-click and context-menu support.
- **Audio controls:** Adjust playback speed, use presets, and repeat audio segments.
- **AI-assisted analysis:** Request Arabic word-group, root, and grammatical analysis using Google Gemini.
- **Reading preferences:** Choose surahs, adjust Arabic font sizes, and customize the reading experience.
- **Modular implementation:** Separated audio, UI, service, and application-state modules.

## Tech Stack

- JavaScript (ES modules)
- HTML and CSS
- Google Gemini API integration
- GitHub Pages hosting

## Repository Structure

```text
js/
├── audio/       # Audio playback
├── data/        # Surah metadata
├── dom/         # DOM utilities
├── services/    # External services and AI integration
├── ui/          # Controls, text selection, and rendering
├── config.js    # Configuration
├── main.js      # Application entry point
└── state.js     # Application state
```

## Run Locally

1. Clone the project:

   ```bash
   git clone https://github.com/SelimUysal/kuran-ezber.git
   cd kuran-ezber
   ```

2. Serve the project through a local web server (such as VS Code Live Server), then open the local address in your browser.

3. AI features may require additional API configuration. **Never commit live API keys or other credentials to a public repository.** For production use, put secret API requests behind a secure backend rather than exposing keys in client-side JavaScript.

## Disclaimer

AI-generated Arabic linguistic and interpretive explanations may contain errors. Verify important information against trusted references.

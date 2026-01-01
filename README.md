# Music Assistant Lovelace Dashboard - Modern Built-in Helpers

A modern, fully client-side Lovelace card for Home Assistant with Music Assistant integration.

## Features
- Built-in helpers for search input and player selection
- Search results with artwork, dynamically listed
- Full queue display with artwork
- Now Playing panel with artwork
- Playback controls: Play / Pause / Next / Previous
- Modern, app-like UI with rounded buttons and responsive layout

## Installation
1. Add this repo to HACS.
2. Add `cards/music-assistant-dashboard.js` as a resource in Lovelace.
3. Use the card in your dashboard:

```yaml
type: custom:music-assistant-dashboard
```

## Built-in Helpers
- `input_text.ma_search` automatically created if missing
- `input_select.ma_player` automatically populated with MA media players

This version is fully self-contained and provides a polished music control experience entirely within Home Assistant.
# Ikariam Resource Overlay Extension

This Chrome Extension enhances the **Ikariam** game interface by displaying:

- 📈 Resource production rates per hour (wood, wine, marble, sulfur, crystal)
- 💰 Gold income or expenses per hour
- 🍷 Wine consumption and how long it will last, rounded to full days

## Features

- Automatically injects additional info into the resource menu
- Highlights positive/negative flows using color
- Displays wine consumption duration (e.g., `1d`, `2d`)

## Example Screenshot

_(Insert a screenshot here if available)_

## Installation

1. Download or clone this repository.
2. Open **Chrome** and go to `chrome://extensions/`
3. Enable **Developer mode** (top right).
4. Click **"Load unpacked"**.
5. Select the folder containing:
   - `manifest.json`
   - `content.js`

## File Structure

ikariam-extension/
├── manifest.json
├── content.js
├── icons.png
├── styles.css

## Notes

- This extension only runs on Ikariam city view pages (`*?view=city*`).
- It does **not** interfere with gameplay or server communication.
- Works best with modern versions of Chrome or Chromium-based browsers.

## License

MIT License – free to use and modify. Not affiliated with Gameforge or Ikariam.

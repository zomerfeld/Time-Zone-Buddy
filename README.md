# FIO Clone - Local Time Zone Planner

A minimal, privacy-preserving clone of "Figure it Out" for Chrome.
This extension overrides your New Tab page with a beautiful, color-coded view of your selected time zones.

## Features

- **Local & Private**: No external API calls. No tracking. All data stays in your browser.
- **Visual**: Rows are colored based on the time of day (Night, Dawn, Day, Dusk).
- **Planning Mode**: Use the slider at the bottom to shift time across all zones to coordinate meetings.
- **Fast**: Built with React and Vite for instant load times.

## How to Install (Chrome/Edge/Brave)

1. **Build the project**:
   If you are running this locally:
   ```bash
   npm install
   npm run build
   ```
   This will create a `dist` folder.

2. **Load the Extension**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable **Developer mode** (top right toggle).
   - Click **Load unpacked**.
   - Select the `dist/public` folder from this project.

3. **Open a New Tab**:
   - You should see the FIO Clone interface.

## Usage

- **Add Zone**: Click the `+` button to search for a city or time zone.
- **Remove Zone**: Hover over a row and click the trash icon.
- **Reorder**: Drag rows by the handle on the left (or use the list order).
- **Set Home**: Click the home icon to make a zone your reference time.
- **Settings**: Toggle 12/24h format in the settings menu.
- **Planning**: Drag the slider at the bottom to see future times. Click "Reset to Now" to return to live time.

# Time Zone Planner

## Overview

A privacy-preserving Chrome extension that overrides the New Tab page with a visual, color-coded time zone planner. It displays multiple time zones with color gradients based on time of day, supports drag-to-reorder, and includes a scroll-to-plan feature for coordinating meetings across time zones. All data stays local in the browser with no external API calls or tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS v4 with custom dark theme optimized for new tab display
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **State Management**: Zustand with cookie persistence for cross-session data storage
- **Routing**: Wouter (lightweight React router)
- **Animations**: Framer Motion for drag-and-drop reordering

### Time Zone Handling
- **Library**: date-fns-tz for IANA timezone conversions and DST handling
- **Data Source**: Browser's built-in `Intl.supportedValuesOf('timeZone')` for timezone list
- **Update Frequency**: Real-time clock updates every second in live mode

### Chrome Extension Structure
- **Manifest**: V3 format with `chrome_url_overrides` for new tab replacement
- **Permissions**: Storage API only (minimal permissions for privacy)
- **Build Output**: `dist/public` folder contains the loadable extension

### Backend Architecture
- **Server**: Express.js with TypeScript (minimal, primarily for development)
- **Purpose**: Serves the built frontend in production; provides hot-reload in development
- **API**: REST structure available at `/api/*` routes (currently minimal usage)

### Data Storage
- **Primary**: Browser cookies via custom Zustand storage adapter
- **Schema**: Drizzle ORM configured for PostgreSQL (available but not actively used for this extension)
- **Local State**: Zone list, home zone selection, time format preference, planning mode state

### Key Design Decisions

1. **Cookie-based persistence over localStorage**: Enables potential cross-subdomain sharing and works reliably in extension context

2. **No external API calls**: All timezone calculations use browser-native APIs and bundled date-fns-tz library for complete offline functionality

3. **Hour-based color gradients**: Each hour has a unique gradient mapping for visual distinction between Night/Dawn/Day/Dusk periods

4. **Scroll-to-plan interaction**: Mouse wheel scrolling adjusts the reference time forward/backward for meeting planning

## External Dependencies

### Core Libraries
- **date-fns / date-fns-tz**: Time manipulation and timezone conversion
- **zustand**: Lightweight state management with persistence middleware
- **framer-motion**: Drag-and-drop animations for zone reordering
- **nanoid**: Unique ID generation for zones

### UI Framework
- **@radix-ui/***: Accessible UI primitives (dialog, popover, slider, etc.)
- **cmdk**: Command palette for city/timezone search
- **lucide-react**: Icon library

### Build & Development
- **Vite**: Build tool with React plugin
- **esbuild**: Server bundling for production
- **Tailwind CSS v4**: Utility-first CSS with @tailwindcss/vite plugin

### Database (Available but Optional)
- **drizzle-orm**: ORM for PostgreSQL
- **pg**: PostgreSQL client
- **connect-pg-simple**: Session storage (if authentication is added)

### Fonts
- **Google Fonts**: Inter (sans-serif) and JetBrains Mono (monospace) loaded via CDN in index.html
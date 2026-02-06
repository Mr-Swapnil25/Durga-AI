# DURGA: Digital Guardian

Cyberpunk-inspired women's safety web app prototype with an SOS workflow, fake call flows, safe-route discovery, and an emergency operations interface.

## Highlights

- SOS trigger with countdown, alert status, and PIN-based cancel flow
- Guardians circle management UI and emergency ops dashboard
- Fake call setup, incoming call, and active call screens
- Safe route discovery with geolocation and quick share actions
- Covert recording UI for evidence capture (simulated)
- Medical ID profile and alerts center
- First-run permissions onboarding

## Tech Stack

- React + Vite
- Tailwind CSS via CDN configuration in `index.html`
- Framer Motion for transitions and micro-interactions
- Flask + Socket.IO backend stub for SOS broadcasting (not yet wired to the UI)

## Quick Start

Frontend:

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`

Backend (optional demo stub):

1. Install dependencies: `pip install flask flask-socketio flask-cors`
2. Start the server: `python backend/app.py`

## Configuration

- `GEMINI_API_KEY` in `.env.local` is reserved for future AI features and is not used by the current UI.
- Google Maps Embed API key is currently hardcoded in `components/SafeRoute.tsx`. Replace it with your own key if you plan to use the map embed in production.

## Project Structure

- `App.tsx` routes between screens and manages view state.
- `components/` contains the feature screens (SOS, Fake Call, Safe Route, Medical ID, Alerts, Permissions).
- `backend/app.py` provides a minimal Socket.IO server for SOS events.
- `metadata.json` defines the app name, description, and requested permissions.

## Demo Notes

This is a UI-first prototype intended for demos and hackathon showcases. It uses mock data and simulated flows and is not a real emergency service.


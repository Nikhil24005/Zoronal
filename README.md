# Zoronal MERN Stack Project

This repository contains a clean MERN starter with a Vite + React + Tailwind frontend and an Express + Mongoose backend written with ES modules.

## Project Structure

- `client/` - React frontend built with Vite and Tailwind CSS
- `server/` - Node.js + Express API with MongoDB via Mongoose
- `.env` - Root environment file used by the backend

## Getting Started

1. Install dependencies for each app.

```bash
cd server
npm install

cd ../client
npm install
```

2. Start the backend.

```bash
cd server
npm run dev
```

3. Start the frontend in a second terminal.

```bash
cd client
npm run dev
```

## Backend Endpoints

- `GET /api/health` - API health check
- `GET /api/users` - List users
- `POST /api/users` - Create a user

## Notes

- The frontend uses an Axios client with a Vite proxy to reach the backend during development.
- The backend loads the root `.env` file automatically.
"# Zoronal" 

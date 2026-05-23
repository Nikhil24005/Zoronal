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

## Environment Variables

Frontend (`client/.env.development` for local development and Vercel project variables for production):

```bash
VITE_API_URL=http://localhost:5000
```

Production frontend value on Vercel:

```bash
VITE_API_URL=https://zoronal-nnj6.onrender.com
```

Backend root `.env` for local development and Render environment variables for production:

```bash
MONGO_URI=your-mongodb-atlas-connection-string
PORT=5000
CLIENT_ORIGIN=http://localhost:3000,http://localhost:5173,http://localhost:5174,https://zoronal-hazel.vercel.app
JWT_SECRET=your-long-random-secret
NODE_ENV=production
```

## Backend Endpoints

- `GET /api/health` - API health check
- `GET /api/users` - List users
- `POST /api/users` - Create a user

## Notes

- The frontend uses a shared Axios client configured from `VITE_API_URL`.
- The backend loads the root `.env` file automatically.
"# Zoronal" 

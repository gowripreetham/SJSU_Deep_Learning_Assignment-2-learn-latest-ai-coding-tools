# LifeTrack – Habit & Todo Tracker

A full-stack web app for tracking daily habits and todos with streak tracking, priority levels, and a clean dashboard.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express (REST API)
- **Database:** Firebase Firestore (free tier)
- **Deployment:** Firebase Hosting (frontend); backend can be deployed to Cloud Run, Railway, or similar

## Features

- **Todos:** Add, edit, delete tasks with priority levels (High / Medium / Low)
- **Strikethrough animation** when marking todos complete
- **Habits:** Add daily habits with one-tap check-in and **streak tracking**
- **Dashboard:** Today’s completion percentage, todo stats, habit streaks
- **Priority badges:** Color-coded (e.g. High = red, Medium = amber, Low = blue)
- **Dark / light mode** toggle with persisted preference
- **Responsive layout** for mobile and desktop
- **Persistent data** via Firebase Firestore

## Project Structure

```
LifeTrack/
├── client/                 # React frontend (Vite + Tailwind)
│   ├── public/
│   ├── src/
│   │   ├── components/     # Navbar, PriorityBadge
│   │   ├── context/        # Theme (dark/light)
│   │   ├── pages/          # Dashboard, Todos, Habits
│   │   ├── api.js          # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                 # Express API
│   ├── index.js
│   ├── firebase.js         # Firebase Admin SDK
│   ├── routes/
│   │   ├── todos.js
│   │   └── habits.js
│   └── package.json
├── .env.example            # Env template
├── .gitignore
├── firebase.json           # Firebase Hosting (client/dist)
└── README.md
```

## Quick demo (no setup)

Run the app with **in-memory storage** – no Firebase or `.env` needed:

```bash
cd LifeTrack
cd server && npm install && cd ..
cd client && npm install && cd ..
npm run demo
```

Then open **http://localhost:3000**. Data is stored in memory for the session (resets when you restart the server).

To run server and client in separate terminals instead:

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

---

## Setup (with Firebase for persistent data)

### 1. Clone and install

```bash
cd LifeTrack
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 2. Firebase project

1. Create a project at [Firebase Console](https://console.firebase.google.com).
2. Enable **Firestore Database** (start in test mode or set rules as needed).
3. Get your **Web app config** (Project Settings → General → Your apps):  
   `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.
4. For the **backend**, create a **Service Account**:  
   Project Settings → Service accounts → Generate new private key.  
   Save the JSON file as `serviceAccountKey.json` in the **project root** (and add it to `.gitignore` – it’s already there).

### 3. Environment variables

**Root (for server):**

```bash
cp .env.example .env
```

Edit `.env`:

- `PORT=5000`
- `FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json`  
  (or use `FIREBASE_SERVICE_ACCOUNT_JSON` with the JSON string for cloud deployment)

**Frontend (optional – only if you call the API from a different origin):**

Create `client/.env` if you need to point to a different API URL:

```env
VITE_API_BASE_URL=http://localhost:5000
```

For local dev, the Vite proxy in `client/vite.config.js` forwards `/api` to `http://localhost:5000`, so you often don’t need this.

### 4. Run locally

**Terminal 1 – API:**

```bash
cd server
npm run dev
```

API: `http://localhost:5000`

**Terminal 2 – Frontend:**

```bash
cd client
npm run dev
```

App: `http://localhost:3000`

Open the app in the browser; the dashboard, todos, and habits will use the Express API and Firestore.

## Deployment

### Frontend (Firebase Hosting)

1. Build the client:

   ```bash
   cd client
   npm run build
   ```

2. From the **project root** (where `firebase.json` is):

   ```bash
   npx firebase login
   npx firebase use <your-project-id>
   npx firebase deploy
   ```

   Hosting will serve the contents of `client/dist` (configured in `firebase.json`).

### Backend

The API must be deployed somewhere and reachable over HTTPS (e.g. Cloud Run, Railway, Render).

- Set `VITE_API_BASE_URL` in your build to that URL (e.g. in CI or in `client/.env.production`), then rebuild the client so the hosted app calls the right API.

### Firestore rules

Tighten rules for production. Example (adjust to your auth if you add it later):

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{id} { allow read, write: if true; }
    match /habits/{id} { allow read, write: if true; }
    match /habitCheckIns/{id} { allow read, write: if true; }
  }
}
```

## Video Walkthrough

<!-- Add your video link here -->
[Video walkthrough](https://example.com/your-video-link)

## License

MIT

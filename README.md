# URL Shortener App

## Prerequisites

- **Node.js** (v18+ recommended)
- **PostgreSQL** (v12+ recommended)
- **npm** or **yarn**

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd project-task
````

---

### 2. Set Up PostgreSQL Database

* Create a new database:

```bash
createdb url_shortener_db
```

* Connect to the database and run the schema:

```bash
psql -d url_shortener_db -f url-shortener-server/schema.sql
```

OR

#### You can create it through the pgAdmin UI and then run the script in the ```schema.sql``` in the Query tool.

---

### 3. Backend Setup

```bash
cd url-shortener-server
npm install
```

* Copy and configure environment variables:

```bash
cp .env.example .env
```

Make sure `.env` contains your PostgreSQL credentials and server port.

#### Start the Backend Server:

```bash
npm run start
```
or

#### Start the Backend Server (Development):
```bash
npm run dev
```

---

### 4. Frontend Setup

```bash
cd ../url-shortener-frontend
npm install
```

* Copy and configure environment variables:

```bash
cp .env.example .env
```

Make sure the API URL in `.env` points to your backend (e.g., `http://localhost:5000`).

#### Start the Frontend App (Development):

```bash
npm run dev
```

---

## Scripts Overview

### Backend (`url-shortener-server`)

| Script        | Description                       |
| ------------- | --------------------------------- |
| `npm start`   | Start server normally             |
| `npm run dev` | Start dev server with TSX watcher |

### Frontend (`url-shortener-frontend`)

| Script            | Description                   |
| ----------------- | ----------------------------- |
| `npm run dev`     | Start Vite dev server         |
| `npm run lint`    | Run ESLint on the codebase    |
---

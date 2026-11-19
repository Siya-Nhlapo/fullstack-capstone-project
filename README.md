# GiftLink

GiftLink is a full-stack gift and household-item sharing application. Users can
browse gifts, search by name and attributes, view item details, and create an
account to manage their profile.

## Overview and key features

- Browse gift records stored in MongoDB.
- Search gifts by name, category, condition, and maximum age.
- Register and log in with email/password authentication.
- Authenticate users with JSON Web Tokens (JWTs) stored by the frontend in
  `sessionStorage`.
- View and update the signed-in user's profile.
- Serve the React application through a Node/Express static-file server.
- Provide an optional sentiment-analysis service using the `natural` package.

## Architecture and tech stack

The application is split into independently installable Node.js projects:

- **Frontend:** React 18, React Router, React Bootstrap, and Create React App
  in `giftlink-frontend/`.
- **Backend:** Node.js and Express in `giftlink-backend/`.
- **Database:** MongoDB, using the `giftdb` database and `gifts` and `users`
  collections.
- **Authentication:** bcrypt password hashing and JWTs.
- **Logging:** Pino and pino-http on the backend.
- **Optional services:** `giftwebsite/` serves a built frontend on port 9000;
  `sentiment/` exposes sentiment analysis on port 3000 by default.
- **Deployment:** Dockerfiles and Kubernetes manifests are included for the
  backend and MongoDB. The repository does not specify a frontend hosting
  provider.

The browser reads `REACT_APP_BACKEND_URL` and calls the Express API. The
backend connects to MongoDB using `MONGODB_URI`. The backend exposes REST
routes under `/api/gifts`, `/api/search`, and `/api/auth`.

## Project structure

```text
.
├── giftlink-frontend/
│   ├── public/                 Static assets and the public landing page
│   ├── src/
│   │   ├── components/         Main, search, login, register, profile, and navigation UI
│   │   ├── context/            Authentication context
│   │   ├── config.js           Reads REACT_APP_BACKEND_URL
│   │   ├── App.js              React routes
│   │   └── index.js            React entry point
│   └── package.json            Frontend scripts and dependencies
├── giftlink-backend/
│   ├── routes/
│   │   ├── authRoutes.js       Registration, login, and profile update routes
│   │   ├── giftRoutes.js       Gift listing, lookup, and creation routes
│   │   └── searchRoutes.js     Gift search route
│   ├── models/db.js            MongoDB connection helper
│   ├── util/import-mongo/      Gift seed data and import utility
│   ├── app.js                  Express server entry point (port 3060)
│   ├── Dockerfile              Backend container image
│   ├── deployment.yml          Backend Kubernetes Deployment and Service
│   └── .env.sample             Backend environment-variable sample
├── giftwebsite/                Express server for serving a frontend build (port 9000)
├── sentiment/                  Optional sentiment-analysis Express service
├── deploymongo.yml              MongoDB Kubernetes Deployment and Service
└── .github/workflows/main.yml  CI build and lint workflow
```

## Getting started

### Prerequisites

- Node.js and npm.
- A running MongoDB instance.
- Git.
- [PLACEHOLDER: Kubernetes and `kubectl`, if using the Kubernetes manifests.]

### Clone the repository

```bash
git clone [PLACEHOLDER:REPOSITORY_URL]
cd fullstack-capstone-project
```

### Install dependencies

Install each project separately:

```bash
cd giftlink-backend
npm install

cd ../giftlink-frontend
npm install

cd ../giftwebsite
npm install

cd ../sentiment
npm install
```

The root `package-lock.json` does not define application scripts; run commands
from the relevant project directory.

### Configure environment variables

Create `giftlink-backend/.env` for local backend development. Do not commit
secrets.

| Variable | Used by | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Backend and Mongo import utility | MongoDB connection URI. The application code reads this name. |
| `JWT_SECRET` | Backend authentication routes | Secret used to sign JWTs. |
| `REACT_APP_BACKEND_URL` | React frontend | Base URL used for frontend API requests. |
| `PORT` | `sentiment/` | Optional sentiment service port; defaults to `3000` when unset. |
| `NODE_ENV` | Backend logger and Kubernetes configuration | Selects production or development logging behavior. |
| `DATASRC` | `giftlink-backend/util/import-mongo/.env.sample` | Listed by the import utility sample; the current import script reads `gifts.json` directly. |

The checked-in backend samples use `MONGO_URL`, but the backend connection code
uses `MONGODB_URI`. Set `MONGODB_URI` in the actual `.env` file.

Example shape, with placeholder values only:

```dotenv
MONGODB_URI=[YOUR_MONGODB_CONNECTION_URI]
JWT_SECRET=[YOUR_JWT_SECRET]
```

For the frontend, set `REACT_APP_BACKEND_URL` in the environment used by
Create React App, for example:

```dotenv
REACT_APP_BACKEND_URL=[YOUR_BACKEND_BASE_URL]
```

### Prepare the database

The backend uses the MongoDB database `giftdb`. The gift import utility seeds
the `gifts` collection from
`giftlink-backend/util/import-mongo/gifts.json` when the collection is empty.
The backend imports this utility during startup.

For a local MongoDB instance, point `MONGODB_URI` at that instance and start
the backend. For Kubernetes, apply the provided MongoDB manifest:

```bash
kubectl apply -f deploymongo.yml
```

[PLACEHOLDER: Provide the required MongoDB credentials/secret creation
commands for the target environment.]

### Run the application locally

Start the backend in one terminal:

```bash
cd giftlink-backend
npm run dev
```

Start the React frontend in another terminal:

```bash
cd giftlink-frontend
npm start
```

The backend listens on port `3060`. The Create React App development server
uses its configured default port unless overridden by the local environment.

## Available scripts

Run these commands from the directory named in each row.

| Directory | Command | Purpose |
| --- | --- | --- |
| `giftlink-backend` | `npm run dev` | Run the backend with nodemon. |
| `giftlink-backend` | `npm start` | Run the backend with Node.js. |
| `giftlink-backend` | `npm test` | Run the configured Mocha tests. |
| `giftlink-frontend` | `npm start` | Start the React development server. |
| `giftlink-frontend` | `npm run build` | Create the production React build. |
| `giftlink-frontend` | `npm test` | Run the configured React test runner. |
| `giftlink-frontend` | `npm run eject` | Eject Create React App configuration. |
| `giftlink-backend/util/import-mongo` | `npm start` | Run the Mongo import utility. |

The `giftwebsite/` and `sentiment/` packages define a placeholder failing
`npm test` script (`Error: no test specified`).

## API and key workflows

All backend API URLs begin with the backend base URL.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | Backend health-style response: `Inside the server`. |
| `GET` | `/api/gifts` | Return all gifts. |
| `GET` | `/api/gifts/:id` | Return one gift by its `id`. |
| `POST` | `/api/gifts` | Insert a gift from the JSON request body. |
| `GET` | `/api/search` | Search gifts using optional `name`, `category`, `condition`, and `age_years` query parameters. |
| `POST` | `/api/auth/register` | Create a user and return an authentication token. |
| `POST` | `/api/auth/login` | Verify credentials and return an authentication token and user details. |
| `PUT` | `/api/auth/update` | Update profile data; the current route expects the user's email in the `Email` request header. |

Typical user flow:

1. Register at `/app/register` or log in at `/app/login`.
2. The frontend stores the returned token, name, and email in
   `sessionStorage`.
3. Browse gifts at `/app` or search at `/app/search`.
4. Open the profile at `/app/profile` to edit the display name.
5. Log out to clear the session values.

The optional sentiment service exposes `POST /sentiment` on its configured
port and returns a sentiment score and label.

## Deployment

### Backend and MongoDB with Kubernetes

The repository includes:

- `deploymongo.yml`, which defines a MongoDB 7.0 Deployment and NodePort
  Service on port `32007`.
- `giftlink-backend/deployment.yml`, which defines two backend replicas and a
  NodePort Service targeting container port `3060`.
- `giftlink-backend/Dockerfile`, which builds the backend image and exposes
  port `3060`.

Build and publish the backend image using the image name expected by the
manifest, or update the manifest for your registry:

```bash
cd giftlink-backend
docker build -t [PLACEHOLDER:BACKEND_IMAGE] .
docker push [PLACEHOLDER:BACKEND_IMAGE]
cd ..
kubectl apply -f deploymongo.yml
kubectl apply -f giftlink-backend/deployment.yml
```

The backend manifest expects a Kubernetes Secret named `giftapp-secrets` and a
ConfigMap named `giftapp-config`; the repository does not provide commands for
creating them. Add `MONGODB_URI`, `JWT_SECRET`, and any required deployment
configuration to those resources before starting the backend.

### Frontend hosting

Build the React frontend with:

```bash
cd giftlink-frontend
npm run build
```

`giftwebsite/` contains an Express server that serves a `build/` directory on
port `9000`, and its Dockerfile packages that server. Copy or otherwise
provide the generated frontend build at the location expected by that service
before deploying it.

[PLACEHOLDER: Specify the frontend hosting provider, image registry, URL, and
deployment commands.]

## CI

The GitHub Actions workflow in `.github/workflows/main.yml` runs on pushes and
pull requests targeting `main` or `master`. It installs Node.js 14, runs the
configured backend JSHint commands, and installs/builds the React frontend.

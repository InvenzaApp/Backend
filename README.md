# Invenza

Invenza - Backend

## About the app

Invenza is a simple app, which allows you to create your team, create groups of users, and follow tasks

## YouTrack
[Open YouTrack](https://invenza.youtrack.cloud/agiles/182-2/current)

## Certificates
Before starting server, you have to create folder `cert` inside `src` folder. Inside you should have 3 certificates:
*  `ca.pem`
* `cert.pem`
* `key.pem`

## Firebase

To initialize Firebase, you have to replace all `FIREBASE_*` variables with proper values.
Also, put your `fcmServiceAccountKey.json` file in root directory.

## Getting Started

To initialize project just run this command in terminal:
```
npm i
```

If you want to start server in development mode, run the commend:
```
npm run dev
```

If you want to start server on server, you have to build with:
```
npm run build
```
Then, start server with:
```
npm run start
```

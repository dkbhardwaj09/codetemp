# DocQuery Firebase Setup

This document provides instructions for setting up the Firebase environment variables required to run the DocQuery application.

## Prerequisites

- A Firebase project. If you don't have one, create a new project at the [Firebase Console](https://console.firebase.google.com/).
- A web app added to your Firebase project.

## Environment Variables

To connect the application to your Firebase project, you need to create a `.env` file in the `Frontend` directory with the following environment variables:

```
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
VITE_FIREBASE_MEASUREMENT_ID="your_measurement_id"
```

You can find these values in your Firebase project settings. For more information, see the [Firebase documentation](https://firebase.google.com/docs/web/setup).

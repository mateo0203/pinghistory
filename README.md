# PingHistory

An Expo React Native app that allows users to send "pings" with optional messages and location data. Built with TypeScript, Firebase, and Expo Router.

## Features

- **Anonymous Authentication**: Users are automatically signed in anonymously
- **Send Pings**: Share messages with optional location data
- **Live Feed**: Real-time ping history with live updates
- **Location Integration**: Automatic location capture (with permission)

## Tech Stack

- **Expo SDK 53** with React Native
- **TypeScript** for type safety
- **Firebase** (Auth + Firestore)

## Setup Instructions

### 1. Prerequisites

- Node.js
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your physical device

### 2. Fill in your Firebase configuration values in `.env`:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the App

```bash
# Start the development server
npx expo start
```

### 7. Test on Physical Device

1. Install **Expo Go** on your iOS/Android device
2. Scan the QR code from the terminal/browser
3. The app will load on your device
```

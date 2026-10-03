# DeadZone

**DeadZone** is a modern, gamified campus spot-finder app. It helps students find the best places to study, game, or relax based on real-time crowdsourced data like noise levels, available outlets, and Wi-Fi speeds.

## 🚀 Getting Started

Since you are running Windows and might encounter PowerShell script execution policy errors, the most reliable way to start the app is to use the traditional Command Prompt (`cmd`).

### 1. Start the Expo Server
Open your terminal inside the `frontend` folder and run this command:
```bash
cmd.exe /c npx expo start --tunnel
```
*(You can also use `-c` to clear the cache if your app isn't updating: `cmd.exe /c npx expo start -c --tunnel`)*

### 2. Run on your device
- Download the **Expo Go** app on your iOS or Android device.
- Scan the QR code that appears in your terminal.
- If you have an Android emulator or iOS simulator running on your PC, press `a` or `i` in the terminal to launch the app directly.

## 🛠 Tech Stack
- **Frontend**: React Native, Expo, React Navigation
- **Styling**: Vanilla React Native StyleSheet with a custom Design System (`theme.ts`)
- **Backend** (Planned): Node.js / Express
- **Database** (Planned): MongoDB / PostgreSQL

## 🎨 Design System
DeadZone features a **Light Campus-Tech Utility** theme heavily inspired by apps like Apple Maps and Linear. It utilizes:
- Soft off-white canvas backgrounds (`#F6F5FB`)
- Stark white elevated cards (`#FFFFFF`)
- Vibrant blue/purple accents (`#5B4BFF`)
- Image-led hero components with absolute positioned status pills.

## 📁 Project Structure

```
DeadZone/
├── frontend/             # React Native Expo app
│   ├── src/
│   │   ├── components/   # Reusable UI elements (HeroSpotCard, SpotListCard, Ring, etc)
│   │   ├── screens/      # App screens (HomeScreen, SpotDetails, etc)
│   │   ├── navigation/   # React Navigation stack setup
│   │   ├── services/     # API/Mock data services
│   │   ├── types/        # TypeScript interfaces
│   │   └── utils/        # theme.ts and helper functions
│   └── App.tsx           # Entry point
├── backend/              # Node.js backend (WIP)
└── tickets/              # Project management & feature requirements
```

# My Track Expenses

A cross-platform expense tracking application built with web technologies and wrapped in a native shell using Capacitor.

## Tech Stack

- **Frontend**: Vanilla JavaScript with Vite
- **Native Shell**: Capacitor (webview-based native app)
- **Platforms**: Android (primary), iOS (future)

## Prerequisites

- Node.js (v18 or later recommended)
- npm (v9 or later)
- Android Studio (for Android development)
- Android SDK (API 22+)
- Java JDK 17+

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development (Web)

Run the app in development mode:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

Build the web app:

```bash
npm run build
```

### Build for Android

1. **Build and sync to Android**:
   ```bash
   npm run build:android
   ```

2. **Open in Android Studio** (optional, for debugging):
   ```bash
   npm run cap:open:android
   ```

3. **Build Debug APK**:
   ```bash
   npm run android:build:debug
   ```
   The APK will be located at `android/app/build/outputs/apk/debug/app-debug.apk`

4. **Build Release APK**:
   ```bash
   npm run android:build:release
   ```
   The APK will be located at `android/app/build/outputs/apk/release/app-release-unsigned.apk`

## Project Structure

```
my-track-expenses/
├── src/                    # Web application source code
├── public/                 # Static assets
├── dist/                   # Built web assets (generated)
├── android/                # Android native project
│   ├── app/               # Android app module
│   └── ...
├── capacitor.config.json   # Capacitor configuration
├── index.html             # Entry HTML file
├── package.json           # Node.js dependencies and scripts
└── vite.config.js         # Vite configuration (if needed)
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build web app for production |
| `npm run preview` | Preview production build |
| `npm run cap:sync` | Sync web assets to native platforms |
| `npm run cap:copy` | Copy web assets to native platforms |
| `npm run cap:open:android` | Open Android project in Android Studio |
| `npm run build:android` | Build web app and sync to Android |
| `npm run android:build:debug` | Build debug APK |
| `npm run android:build:release` | Build release APK |

## License

See [LICENSE](LICENSE) file for details.
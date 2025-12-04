# My Track Expenses

A cross-platform expense tracking application built with Vue 3, TypeScript, and wrapped in a native shell using Capacitor.

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vuetify (Material Design)
- **State Management**: Pinia
- **Routing**: Vue Router
- **Native Shell**: Capacitor (webview-based native app)
- **Platforms**: Android (Kotlin)

## Prerequisites

- Node.js (v18 or later recommended)
- npm (v9 or later)
- Android Studio (for Android development)
- Android SDK (API 23+)
- Java JDK 21+

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

### Development (Device/Emulator with Live Reload)

Run the app on a real device or emulator with hot module replacement (HMR) for real-time updates:

1. **Get your local IP address**:
   - **Linux/macOS**: `ip addr` or `ifconfig`
   - **Windows**: `ipconfig`

2. **Start the development server with host access** (in one terminal):
   ```bash
   npm run dev:host
   ```
   This starts Vite with network access enabled. Note the URL shown (e.g., `http://192.168.1.100:5173`).

3. **Sync to Android with live reload** (in another terminal):
   ```bash
   LIVE_RELOAD_SERVER=http://YOUR_LOCAL_IP:5173 npm run cap:sync
   ```
   Replace `YOUR_LOCAL_IP` with your actual local IP address.

4. **Run on device/emulator**:
   ```bash
   npm run cap:run:android
   ```
   Or open Android Studio and run from there:
   ```bash
   npm run cap:open:android
   ```

> **Note**: Ensure your device/emulator and computer are on the same network. For emulators, you may need to use your host machine's IP address.

> **Tip**: Any changes you make to the source code will be automatically reflected on the device/emulator via hot module replacement.

### Run Tests

```bash
npm run test
```

### Lint and Type Check

```bash
npm run lint
npm run type-check
```

### Build for Production

Build the web app:

```bash
npm run build
```

### Build for Android

> **Note**: Capacitor 7 requires Java 21. If you have multiple Java versions installed, ensure `JAVA_HOME` is set to your Java 21 installation:
> - **Linux**: `export JAVA_HOME=/usr/lib/jvm/java-21-openjdk`
> - **macOS**: `export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home`
> - **Windows**: `set JAVA_HOME=C:\Program Files\Java\jdk-21`

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
├── src/                    # Vue application source code
│   ├── components/         # Reusable Vue components
│   ├── views/              # Page components
│   ├── router/             # Vue Router configuration
│   ├── stores/             # Pinia stores
│   ├── __tests__/          # Unit tests
│   ├── App.vue             # Root Vue component
│   └── main.ts             # Application entry point
├── public/                 # Static assets
├── dist/                   # Built web assets (generated)
├── android/                # Android native project (Kotlin)
│   ├── app/               # Android app module
│   └── ...
├── capacitor.config.ts     # Capacitor configuration (TypeScript)
├── index.html             # Entry HTML file
├── package.json           # Node.js dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── vitest.config.ts       # Vitest test configuration
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run dev:host` | Start development server with network access (for live reload) |
| `npm run build` | Build web app for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run cap:sync` | Sync web assets to native platforms |
| `npm run cap:copy` | Copy web assets to native platforms |
| `npm run cap:open:android` | Open Android project in Android Studio |
| `npm run cap:run:android` | Run app on connected Android device/emulator |
| `npm run build:android` | Build web app and sync to Android |
| `npm run android:build:debug` | Build debug APK |
| `npm run android:build:release` | Build release APK |

## CI/CD

This project uses GitHub Actions for continuous integration:

- **Lint and Test**: Runs on all pushes and pull requests
  - ESLint for code quality
  - TypeScript type checking
  - Unit tests with Vitest
  - Web app build verification

- **Android Build**: Builds debug APK after successful lint and test
  - Requires Java 21
  - Uploads APK as build artifact

## License

See [LICENSE](LICENSE) file for details.
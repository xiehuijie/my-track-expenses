# Copilot Custom Agent Description

## Project Overview

**my-track-expenses** is a cross-platform expense tracking application built with:

- **Vue 3 + TypeScript** for the frontend
- **Vite** as the build tool
- **Capacitor** for native mobile capabilities (Android/iOS)
- **Vuetify** for Material Design UI components
- **Pinia** for state management
- **vue-i18n** for internationalization
- **UnoCSS** with Tailwind4 preset for utility-first styling

## Agent Capabilities

### Code Review Agent

- Review Vue 3 Composition API code patterns
- Check TypeScript type safety
- Validate Capacitor plugin usage
- Ensure consistent Material Design patterns
- Review i18n message key usage

### Development Agent

- Generate Vue 3 components with TypeScript
- Create Pinia stores with proper typing
- Implement database entities and services using TypeORM + SQLite
- Configure UnoCSS/Tailwind classes
- Add i18n translations

## Project Conventions

### Code Style

- Use Vue 3 Composition API with `<script setup lang="ts">`
- Follow ESLint + TypeScript-ESLint recommended rules
- Use `@/` path alias for src directory imports
- Prefer Vuetify components for UI elements

### File Structure

```
src/
├── components/     # Reusable Vue components
├── views/          # Page-level components
├── stores/         # Pinia stores
├── db/             # Database entities and services
├── locales/        # i18n translation files (zh-CN.json, en-US.json)
├── router/         # Vue Router configuration
└── styles/         # Global styles and theme configuration
```

### Database Layer

- Use @capacitor-community/sqlite for native SQLite access
- Define TypeORM entities in `src/db/entities/`
- Implement repository services in `src/db/services/`
- Ensure all database operations are typed

### Theming

- Support 5 primary theme colors: blue, green, yellow, pink, purple
- Implement light/dark mode with system preference detection
- Use CSS custom properties for dynamic theming
- Follow Material Design 3 color guidelines

### Internationalization

- Store translations in `src/locales/` as JSON files
- Support zh-CN (Simplified Chinese) and en-US (English)
- Use vue-i18n for translation management

### Mobile Considerations

- Use Capacitor Safe Area plugin for device notches
- Implement proper viewport handling (100vw × 100vh)
- Disable page zoom and scroll on root container
- Handle virtual keyboard and navigation bar safe areas

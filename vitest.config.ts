import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { execSync } from 'child_process'
import packageJson from './package.json'

// Get commit count for version suffix
function getCommitCount(): string {
  try {
    return execSync('git rev-list --count HEAD', { encoding: 'utf-8' }).trim()
  } catch {
    return '0'
  }
}

// Generate app version: x.x.x-yyyyy (package version + commit count)
const appVersion = `${packageJson.version}-${getCommitCount()}`

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(appVersion)
  },
  test: {
    environment: 'jsdom',
    globals: true
  }
})

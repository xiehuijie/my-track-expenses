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
export const appVersion = `${packageJson.version}-${getCommitCount()}`

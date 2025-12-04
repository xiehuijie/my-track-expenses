import { defineConfig } from 'unocss'
import presetWind4 from '@unocss/preset-wind4'

export default defineConfig({
  presets: [
    presetWind4()
  ],
  theme: {
    colors: {
      // Theme colors - Primary color variants
      primary: {
        blue: {
          light: '#1976D2',
          dark: '#90CAF9',
          DEFAULT: '#2196F3'
        },
        green: {
          light: '#388E3C',
          dark: '#81C784',
          DEFAULT: '#4CAF50'
        },
        yellow: {
          light: '#F9A825',
          dark: '#FFE082',
          DEFAULT: '#FFC107'
        },
        pink: {
          light: '#C2185B',
          dark: '#F48FB1',
          DEFAULT: '#E91E63'
        },
        purple: {
          light: '#7B1FA2',
          dark: '#CE93D8',
          DEFAULT: '#9C27B0'
        }
      }
    }
  },
  shortcuts: {
    'safe-area-top': 'pt-[env(safe-area-inset-top)]',
    'safe-area-bottom': 'pb-[env(safe-area-inset-bottom)]',
    'safe-area-left': 'pl-[env(safe-area-inset-left)]',
    'safe-area-right': 'pr-[env(safe-area-inset-right)]',
    'full-viewport': 'w-100vw h-100vh overflow-hidden',
    'flex-center': 'flex items-center justify-center'
  }
})

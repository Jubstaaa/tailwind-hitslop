import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { vitePrerenderPlugin } from 'vite-prerender-plugin'

export default defineConfig({
    plugins: [react(), tailwindcss(), vitePrerenderPlugin({ renderTarget: '#root' })],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})

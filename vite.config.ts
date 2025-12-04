import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'index.ts'),
            name: 'VitePluginUniReplaceImage',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
        },
        rollupOptions: {
            external: ['vite', 'node:fs/promises', 'node:path', 'node:process'],
            output: {
                globals: {
                    vite: 'Vite'
                }
            }
        }
    }
})

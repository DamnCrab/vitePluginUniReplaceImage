import { defineConfig } from 'vite'
import path from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        dts({
            insertTypesEntry: true,
        }),
    ],
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

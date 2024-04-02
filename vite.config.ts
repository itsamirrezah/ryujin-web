import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    css: {
        modules: {
            localsConvention: "camelCase"
        }
    },
    server: {
        https: {
            key: "./secrets/private.key",
            cert: "./secrets/certificate.crt"
        },
        host: '0.0.0.0',
        port: 3000
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, './src')
        }
    }
})

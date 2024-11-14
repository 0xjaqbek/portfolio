import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
 base: '/portfolio/',
 plugins: [react()],
 server: {
   headers: {
     'Content-Security-Policy': `
       default-src 'self';
       script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' chrome-extension: blob:;
       style-src 'self' 'unsafe-inline';
       img-src 'self' data: blob: chrome-extension:;
       connect-src 'self' https://api.emailjs.com chrome-extension:;
       font-src 'self';
     `.replace(/\s+/g, ' ').trim()
   }
 }
});
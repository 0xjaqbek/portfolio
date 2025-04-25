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
       style-src 'self' 'unsafe-inline' chrome-extension:;
       img-src 'self' data: blob: chrome-extension:;
       connect-src 'self' https://api.emailjs.com https://portfolioasistant-0081e8bd2f7d.herokuapp.com/ chrome-extension:;
       font-src 'self';
       worker-src 'self' blob:;
       frame-src 'self' chrome-extension:;
       script-src-elem 'self' 'unsafe-inline' chrome-extension:;
       style-src-elem 'self' 'unsafe-inline' chrome-extension:;
     `.replace(/\s+/g, ' ').trim()
   }
 }
});
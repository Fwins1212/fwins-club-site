import {defineConfig} from 'vite';
import {resolve} from 'node:path';
export default defineConfig({build:{rollupOptions:{input:{home:resolve('index.html'),membership:resolve('membership.html')}}}});

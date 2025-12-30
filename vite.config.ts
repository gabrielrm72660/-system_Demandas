import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Define o caminho base como relativo para que os arquivos sejam encontrados no GitHub Pages
  base: './', 
  
  plugins: [react()],
  
  build: {
    // Garante que a pasta de saída seja 'dist' para o workflow do GitHub localizar
    outDir: 'dist',
    // Organiza arquivos JS e CSS dentro de uma pasta assets
    assetsDir: 'assets',
    // Desativa sourcemaps para um build mais leve em produção
    sourcemap: false,
    // Garante que o build limpe a pasta antes de gerar uma nova
    emptyOutDir: true
  }
});

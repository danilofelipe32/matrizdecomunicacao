import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente do diretório atual.
  // O terceiro parâmetro '' diz ao Vite para carregar todas as variáveis, 
  // não apenas as que começam com VITE_. Isso permite ler 'API_KEY' direto da Vercel.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Define a substituição global: onde o código usar process.env.API_KEY,
      // o Vite substituirá pelo valor da string da chave durante o build.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    build: {
      target: 'esnext', // Garante compatibilidade com recursos modernos
    }
  };
});
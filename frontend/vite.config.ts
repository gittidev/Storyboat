/// <reference types="node" />

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd());
  // Build용 주석 ggㅎㅎg
  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      proxy: {
        [env.VITE_BASE_URL]: {
          target: env.VITE_SERVER_URL, // 로드된 환경 변수 사용
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_BASE_URL}`), ''),
        },
      },
    },
  };
});

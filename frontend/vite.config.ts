import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 문자열만: http://localhost:5173/foo -> http://localhost:4567/foo
      // '/foo': 'http://localhost:4567',
      // 옵션과 함께: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: 'https://i11c107.p.ssafy.io/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // 정규식(RegEx)과 함께: http://localhost:5173/fallback/ -> http://jsonplaceholder.typicode.com/
      // '^/fallback/.*': {
      //   target: 'http://jsonplaceholder.typicode.com',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/fallback/, '')
      // },
      // // 프락시 인스턴스 사용
      // '/api': {
      //   target: 'http://jsonplaceholder.typicode.com',
      //   changeOrigin: true,
      //   configure: (proxy, options) => {
      //     // proxy 변수에는 'http-proxy'의 인스턴스가 전달됩니다
      //   }
      // },
      // // 웹소켓 또는 socket.io 프락시: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
      // // `rewriteWsOrigin`을 사용할 때는 주의하세요. CSRF 공격에 노출될 수 있습니다.
      // '/socket.io': {
      //   target: 'ws://localhost:5174',
      //   ws: true,
      //   rewriteWsOrigin: true,
      // }
    }
  }
})
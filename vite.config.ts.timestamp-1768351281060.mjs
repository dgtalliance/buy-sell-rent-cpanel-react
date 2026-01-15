// vite.config.ts
import { defineConfig } from 'file:///app/node_modules/vite/dist/node/index.js';
import react from 'file:///app/node_modules/@vitejs/plugin-react/dist/index.mjs';
import { createHtmlPlugin } from 'file:///app/node_modules/vite-plugin-html/dist/index.mjs';
var vite_config_default = defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [
        createHtmlPlugin({
          template: 'index.local.html',
        }),
        react(),
      ],
      server: {
        host: true,
        port: 5173,
        watch: {
          usePolling: true,
        },
      },
    };
  }
  return {
    plugins: [react()],
  };
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLWh0bWwnO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQgfSkgPT4ge1xyXG4gIGlmIChjb21tYW5kID09PSAnc2VydmUnKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgY3JlYXRlSHRtbFBsdWdpbih7XHJcbiAgICAgICAgICB0ZW1wbGF0ZTogJ2luZGV4LmxvY2FsLmh0bWwnLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIHJlYWN0KCksXHJcbiAgICAgIF0sXHJcbiAgICAgIHNlcnZlcjoge1xyXG4gICAgICAgIGhvc3Q6IHRydWUsXHJcbiAgICAgICAgcG9ydDogNTE3MyxcclxuICAgICAgICB3YXRjaDoge1xyXG4gICAgICAgICAgdXNlUG9sbGluZzogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICB9XHJcbiAgcmV0dXJuIHtcclxuICAgIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuICB9O1xyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4TCxTQUFTLG9CQUFvQjtBQUMzTixPQUFPLFdBQVc7QUFDbEIsU0FBUyx3QkFBd0I7QUFHakMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxRQUFRLE1BQU07QUFDM0MsTUFBSSxZQUFZLFNBQVM7QUFDdkIsV0FBTztBQUFBLE1BQ0wsU0FBUztBQUFBLFFBQ1AsaUJBQWlCO0FBQUEsVUFDZixVQUFVO0FBQUEsUUFDWixDQUFDO0FBQUEsUUFDRCxNQUFNO0FBQUEsTUFDUjtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sT0FBTztBQUFBLFVBQ0wsWUFBWTtBQUFBLFFBQ2Q7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDQSxTQUFPO0FBQUEsSUFDTCxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDbkI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=

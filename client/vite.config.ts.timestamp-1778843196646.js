// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/icon.svg"],
      manifest: {
        name: "Elementary Learning Hub",
        short_name: "Learning Hub",
        description: "Interactive learning for elementary students",
        theme_color: "#8B5CF6",
        background_color: "#FDF2F8",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "/icons/icon.svg", sizes: "512x512", type: "image/svg+xml", purpose: "any" },
          { src: "/icons/icon.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"]
      },
      devOptions: { enabled: true }
    })
  ],
  server: {
    port: 5173,
    proxy: { "/api": { target: "http://localhost:3001", changeOrigin: true } }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIFZpdGVQV0Eoe1xyXG4gICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcclxuICAgICAgaW5jbHVkZUFzc2V0czogWydmYXZpY29uLnN2ZycsICdpY29ucy9pY29uLnN2ZyddLFxyXG4gICAgICBtYW5pZmVzdDoge1xyXG4gICAgICAgIG5hbWU6ICdFbGVtZW50YXJ5IExlYXJuaW5nIEh1YicsXHJcbiAgICAgICAgc2hvcnRfbmFtZTogJ0xlYXJuaW5nIEh1YicsXHJcbiAgICAgICAgZGVzY3JpcHRpb246ICdJbnRlcmFjdGl2ZSBsZWFybmluZyBmb3IgZWxlbWVudGFyeSBzdHVkZW50cycsXHJcbiAgICAgICAgdGhlbWVfY29sb3I6ICcjOEI1Q0Y2JyxcclxuICAgICAgICBiYWNrZ3JvdW5kX2NvbG9yOiAnI0ZERjJGOCcsXHJcbiAgICAgICAgZGlzcGxheTogJ3N0YW5kYWxvbmUnLFxyXG4gICAgICAgIG9yaWVudGF0aW9uOiAncG9ydHJhaXQtcHJpbWFyeScsXHJcbiAgICAgICAgc2NvcGU6ICcvJyxcclxuICAgICAgICBzdGFydF91cmw6ICcvJyxcclxuICAgICAgICBpY29uczogW1xyXG4gICAgICAgICAgeyBzcmM6ICcvaWNvbnMvaWNvbi5zdmcnLCBzaXplczogJzUxMng1MTInLCB0eXBlOiAnaW1hZ2Uvc3ZnK3htbCcsIHB1cnBvc2U6ICdhbnknIH0sXHJcbiAgICAgICAgICB7IHNyYzogJy9pY29ucy9pY29uLnN2ZycsIHNpemVzOiAnNTEyeDUxMicsIHR5cGU6ICdpbWFnZS9zdmcreG1sJywgcHVycG9zZTogJ21hc2thYmxlJyB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHdvcmtib3g6IHtcclxuICAgICAgICBnbG9iUGF0dGVybnM6IFsnKiovKi57anMsY3NzLGh0bWwsaWNvLHBuZyxzdmcsd29mZjJ9J10sXHJcbiAgICAgIH0sXHJcbiAgICAgIGRldk9wdGlvbnM6IHsgZW5hYmxlZDogdHJ1ZSB9LFxyXG4gICAgfSksXHJcbiAgXSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDUxNzMsXHJcbiAgICBwcm94eTogeyAnL2FwaSc6IHsgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDozMDAxJywgY2hhbmdlT3JpZ2luOiB0cnVlIH0gfSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFFeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLE1BQ04sY0FBYztBQUFBLE1BQ2QsZUFBZSxDQUFDLGVBQWUsZ0JBQWdCO0FBQUEsTUFDL0MsVUFBVTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osYUFBYTtBQUFBLFFBQ2IsYUFBYTtBQUFBLFFBQ2Isa0JBQWtCO0FBQUEsUUFDbEIsU0FBUztBQUFBLFFBQ1QsYUFBYTtBQUFBLFFBQ2IsT0FBTztBQUFBLFFBQ1AsV0FBVztBQUFBLFFBQ1gsT0FBTztBQUFBLFVBQ0wsRUFBRSxLQUFLLG1CQUFtQixPQUFPLFdBQVcsTUFBTSxpQkFBaUIsU0FBUyxNQUFNO0FBQUEsVUFDbEYsRUFBRSxLQUFLLG1CQUFtQixPQUFPLFdBQVcsTUFBTSxpQkFBaUIsU0FBUyxXQUFXO0FBQUEsUUFDekY7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxjQUFjLENBQUMsc0NBQXNDO0FBQUEsTUFDdkQ7QUFBQSxNQUNBLFlBQVksRUFBRSxTQUFTLEtBQUs7QUFBQSxJQUM5QixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLHlCQUF5QixjQUFjLEtBQUssRUFBRTtBQUFBLEVBQzNFO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

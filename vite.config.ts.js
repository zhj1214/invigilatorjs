// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
import Components from "unplugin-vue-components/vite";
import progress from "vite-plugin-progress";
var vite_config_default = defineConfig({
  plugins: [
    uni(),
    progress(),
    VueSetupExtend(),
    Components({
      dts: false
    })
  ],
  base: "/",
  publicDir: "public",
  resolve: {
    extensions: [".js", ".ts", ".vue", ".json", ".scss"],
    alias: {
      "@src": resolve("/Users/supaur/Desktop/gitProject/alpha/fe-mall-h5", "src"),
      "@api": resolve("/Users/supaur/Desktop/gitProject/alpha/fe-mall-h5", "src/api"),
      "@util": resolve("/Users/supaur/Desktop/gitProject/alpha/fe-mall-h5", "src/util"),
      $dayjs: resolve("/Users/supaur/Desktop/gitProject/alpha/fe-mall-h5", "node_modules/dayjs/esm/index")
    }
  },
  build: {
    sourcemap: true
  },
  server: {
    proxy: {
      "/back": {
        target: "https://ma-wechat-biz.alpha-sit.supaur.tech",
        changeOrigin: true,
        rewrite: (path) => {
          console.log(path);
          return path.replace(/^\/back/, "");
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdW5pIGZyb20gJ0BkY2xvdWRpby92aXRlLXBsdWdpbi11bmknXHJcbmltcG9ydCBWdWVTZXR1cEV4dGVuZCBmcm9tICd2aXRlLXBsdWdpbi12dWUtc2V0dXAtZXh0ZW5kJ1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG4vLyBpbXBvcnQgeyBTYVVpUmVzb2x2ZXIsIEhvdFVuaVNjc3NWaXRlUGx1Z2luIH0gZnJvbSAnQHN1cGF1ci13b3Jrcy9zYS11aS92aXRlJ1xyXG5pbXBvcnQgcHJvZ3Jlc3MgZnJvbSAndml0ZS1wbHVnaW4tcHJvZ3Jlc3MnXHJcbmltcG9ydCBhcHBsZXRjaSBmcm9tICd2aXRlLWFwcGxldC1jaSdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgdW5pKCksXHJcbiAgICAvLyBhcHBsZXRjaSh7XHJcbiAgICAvLyAgIGFwcElkOiAnd3hiYjdjNjIwNjNhOWVmOWZmJyxcclxuICAgIC8vICAgcHJvamVjdFBhdGg6ICdkaXN0L2J1aWxkL21wLXdlaXhpbicsXHJcbiAgICAvLyAgIHByaXZhdGVLZXk6ICdzY3JpcHRzL3ByaXZhdGUud3hiYjdjNjIwNjNhOWVmOWZmLmtleSdcclxuICAgIC8vIH0pLFxyXG4gICAgcHJvZ3Jlc3MoKSxcclxuICAgIFZ1ZVNldHVwRXh0ZW5kKCksXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgZHRzOiBmYWxzZVxyXG4gICAgICAvLyByZXNvbHZlcnM6IFtTYVVpUmVzb2x2ZXIoKV1cclxuICAgIH0pXHJcbiAgICAvLyBIb3RVbmlTY3NzVml0ZVBsdWdpbigpXHJcbiAgXSxcclxuICBiYXNlOiAnLycsXHJcbiAgcHVibGljRGlyOiAncHVibGljJyxcclxuICByZXNvbHZlOiB7XHJcbiAgICBleHRlbnNpb25zOiBbJy5qcycsICcudHMnLCAnLnZ1ZScsICcuanNvbicsICcuc2NzcyddLFxyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0BzcmMnOiByZXNvbHZlKFwiL1VzZXJzL3N1cGF1ci9EZXNrdG9wL2dpdFByb2plY3QvYWxwaGEvZmUtbWFsbC1oNVwiLCAnc3JjJyksXHJcbiAgICAgICdAYXBpJzogcmVzb2x2ZShcIi9Vc2Vycy9zdXBhdXIvRGVza3RvcC9naXRQcm9qZWN0L2FscGhhL2ZlLW1hbGwtaDVcIiwgJ3NyYy9hcGknKSxcclxuICAgICAgJ0B1dGlsJzogcmVzb2x2ZShcIi9Vc2Vycy9zdXBhdXIvRGVza3RvcC9naXRQcm9qZWN0L2FscGhhL2ZlLW1hbGwtaDVcIiwgJ3NyYy91dGlsJyksXHJcbiAgICAgICRkYXlqczogcmVzb2x2ZShcIi9Vc2Vycy9zdXBhdXIvRGVza3RvcC9naXRQcm9qZWN0L2FscGhhL2ZlLW1hbGwtaDVcIiwgJ25vZGVfbW9kdWxlcy9kYXlqcy9lc20vaW5kZXgnKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIHNvdXJjZW1hcDogdHJ1ZVxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwcm94eToge1xyXG4gICAgICAnL2JhY2snOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9tYS13ZWNoYXQtYml6LmFscGhhLXNpdC5zdXBhdXIudGVjaCcsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhwYXRoKVxyXG4gICAgICAgICAgcmV0dXJuIHBhdGgucmVwbGFjZSgvXlxcL2JhY2svLCAnJylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxTQUFTLGVBQWU7QUFDeEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sb0JBQW9CO0FBQzNCLE9BQU8sZ0JBQWdCO0FBRXZCLE9BQU8sY0FBYztBQUdyQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFNSixTQUFTO0FBQUEsSUFDVCxlQUFlO0FBQUEsSUFDZixXQUFXO0FBQUEsTUFDVCxLQUFLO0FBQUEsSUFFUCxDQUFDO0FBQUEsRUFFSDtBQUFBLEVBQ0EsTUFBTTtBQUFBLEVBQ04sV0FBVztBQUFBLEVBQ1gsU0FBUztBQUFBLElBQ1AsWUFBWSxDQUFDLE9BQU8sT0FBTyxRQUFRLFNBQVMsT0FBTztBQUFBLElBQ25ELE9BQU87QUFBQSxNQUNMLFFBQVEsUUFBUSxxREFBcUQsS0FBSztBQUFBLE1BQzFFLFFBQVEsUUFBUSxxREFBcUQsU0FBUztBQUFBLE1BQzlFLFNBQVMsUUFBUSxxREFBcUQsVUFBVTtBQUFBLE1BQ2hGLFFBQVEsUUFBUSxxREFBcUQsOEJBQThCO0FBQUEsSUFDckc7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsU0FBUztBQUFBLFFBQ1AsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVM7QUFDakIsa0JBQVEsSUFBSSxJQUFJO0FBQ2hCLGlCQUFPLEtBQUssUUFBUSxXQUFXLEVBQUU7QUFBQSxRQUNuQztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

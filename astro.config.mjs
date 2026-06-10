import { defineConfig } from 'astro/config';

// Deployed to GitHub Pages (user site) at https://danknowsaguy-web.github.io/
export default defineConfig({
  site: 'https://danknowsaguy-web.github.io',
  // Dedicated dev port for THIS project so it never collides with other
  // Astro projects fighting over the default 4321. strictPort makes a
  // collision fail loudly instead of silently grabbing the wrong port.
  server: { port: 4317, strictPort: true },
});

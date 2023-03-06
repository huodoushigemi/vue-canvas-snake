import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as PIXI from 'pixi.js'
import compression from 'vite-plugin-compression'
import { dependencies } from './package.json'

const PIXI_TAG = Object.entries(PIXI)
  // @ts-ignore
  .filter(([key, val]) => val.prototype instanceof PIXI.DisplayObject)
  .map(([e]) => e)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => PIXI_TAG.includes(tag)
        }
      }
    }),
    compression()
  ],
  build: {
    outDir: 'docs',
    rollupOptions: {
      manualChunks: {
        vue: Object.keys(dependencies).filter(e => /^(vue|@vue\/.+)$/.test(e)),
        vueuse: Object.keys(dependencies).filter(e => /@vueuse/.test(e)),
        pixijs: ['pixi.js']
      }
    }
  },
})

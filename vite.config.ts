import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as PIXI from 'pixi.js'

const PIXI_EL = Object.entries(PIXI)
  // @ts-ignore
  .filter(([key, val]) => val.prototype instanceof PIXI.DisplayObject)
  .map(([e]) => e)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => PIXI_EL.includes(tag)
        }
      }
    })
  ]
})

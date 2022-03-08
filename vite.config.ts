import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import preprocess from 'svelte-preprocess'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve:{
    alias: {
      $lib: '/src/lib',
      $assets: '/src/assets',
    }
  },
  plugins: [
		svelte({
			preprocess: preprocess({
        postcss: true
      })
		})
	]
})

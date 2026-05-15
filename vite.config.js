import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add this line right here! Make sure the slashes are there.
  base: '/InventoryManagementApp_React/', 
})
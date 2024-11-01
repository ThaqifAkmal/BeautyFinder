const { contextBridge, ipcRenderer } = require('electron');
const axios = require('axios');

// Expose the API to the renderer process for fetching products
contextBridge.exposeInMainWorld('api', {
  fetchProducts: async (brand) => {
    try {
      const response = await axios.get(`http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },
});

// Expose navigation functions for Wishlist and Products pages
contextBridge.exposeInMainWorld('electronAPI', {
  openWishlist: () => ipcRenderer.send('open-wishlist'),
  openProducts: () => ipcRenderer.send('open-products')
});

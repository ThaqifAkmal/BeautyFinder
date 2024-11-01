const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV !== 'development';

function createWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Beauty Finder',
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // This may be needed based on your Electron version
        },
    });

    if (isDev){
        mainWindow.webContents.openDevTools();
    }
    // Load the initial HTML file (main page)
    mainWindow.loadFile(path.join(__dirname, './src/index.html')); // Change this to your main HTML file

    // Uncomment the following line if you want to open the DevTools.
}

function createWishlistWindow() {
    const wishlistWindow = new BrowserWindow({
        title: 'My Wishlist',
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // This may be needed based on your Electron version
        },
    });

    if (isDev){
        wishlistWindow.webContents.openDevTools();
    }
    // Load the initial HTML file (main page)
    wishlistWindow.loadFile(path.join(__dirname, './src/wishlist.html')); // Change this to your main HTML file

    // Uncomment the following line if you want to open the DevTools.
}

function createProductsWindow() {
    const productsWindow = new BrowserWindow({
        title: 'All products',
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // This may be needed based on your Electron version
        },
    });

    if (isDev){
        productsWindow.webContents.openDevTools();
    }
    // Load the initial HTML file (main page)
    productsWindow.loadFile(path.join(__dirname, './src/products.html')); // Change this to your main HTML file

    // Uncomment the following line if you want to open the DevTools.
}

ipcMain.on('open-wishlist', createWishlistWindow);
ipcMain.on('open-products', createProductsWindow);
// Call the createWindow function when the app is ready
app.whenReady().then(createWindow);

// Handle window close events
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Recreate the window when the app is activated (on macOS)
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

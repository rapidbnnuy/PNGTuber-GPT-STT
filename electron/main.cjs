const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: '#0f172a', // Match bg-slate-900
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs')
        }
    });

    // Remove menu bar for cleaner look (optional, but requested "client facing")
    win.setMenuBarVisibility(false);

    // Load app
    if (process.env.NODE_ENV === 'development' || process.env.BROWSER === 'none') {
        win.loadURL('http://localhost:5173');
        // win.webContents.openDevTools(); // Uncomment for debugging
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

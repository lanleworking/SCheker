import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createMainWindow, closeMainWindow, hasOpenWindows } from './utils/windowManager';
import { registerAllIpcHandlers } from './utils/ipcHandlers';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set up application root path
process.env.APP_ROOT = path.join(__dirname, '..');

// Set up public path for resources
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, 'public')
    : path.join(process.env.APP_ROOT, 'dist');

// Application event handlers
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (!hasOpenWindows()) {
        createMainWindow();
    }
});

// Initialize the application
app.whenReady().then(() => {
    // Register all IPC handlers
    registerAllIpcHandlers();

    // Create the main window
    createMainWindow();
});

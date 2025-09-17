import { app } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createMainWindow, hasOpenWindows } from './utils/windowManager';
import { registerAllIpcHandlers } from './utils/ipcHandlers';
import { appUpdater } from './utils/autoUpdater';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    const mainWindow = createMainWindow();

    // Initialize auto-updater
    if (mainWindow) {
        appUpdater.setMainWindow(mainWindow);

        // Check for updates on startup (after a delay to ensure app is fully loaded)
        setTimeout(() => {
            appUpdater.checkForUpdates();
        }, 3000);

        // Start periodic update checks (every 60 minutes)
        appUpdater.startPeriodicUpdateCheck(60);
    }
});

import { BrowserWindow } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow: BrowserWindow | null = null;

/**
 * Get application paths
 */
function getPaths() {
    const APP_ROOT = path.join(__dirname, '..');
    const RENDERER_DIST = path.join(APP_ROOT, 'dist');

    // Check if running in development mode by checking if dist folder has index.html
    const isDevelopment = !fs.existsSync(path.join(RENDERER_DIST, 'index.html'));
    const VITE_DEV_SERVER_URL = isDevelopment ? 'http://localhost:3000' : null;

    return {
        APP_ROOT,
        VITE_DEV_SERVER_URL,
        RENDERER_DIST,
    };
}

/**
 * Create and configure the main application window
 */
export function createMainWindow(): BrowserWindow {
    const paths = getPaths();

    // Determine icon path
    let iconPath: string;
    try {
        const publicIconPath = path.join(paths.APP_ROOT, 'public/icon.ico');
        const buildIconPath = path.join(paths.APP_ROOT, 'build/icon.ico');

        if (fs.existsSync(buildIconPath)) {
            iconPath = buildIconPath;
        } else if (fs.existsSync(publicIconPath)) {
            iconPath = publicIconPath;
        } else {
            iconPath = path.join(__dirname, '../../public/icon.ico');
        }
    } catch (error) {
        iconPath = path.join(__dirname, '../../public/icon.ico');
    }

    // Determine preload script path
    const preloadPath = path.join(paths.APP_ROOT, 'dist-electron/preload.js');

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        icon: iconPath,
        webPreferences: {
            preload: preloadPath,
            nodeIntegration: false,
            contextIsolation: true,
        },
        frame: true,
        titleBarStyle: 'default',
        autoHideMenuBar: true,
        show: false, // Don't show until ready
    });

    // Set up window event handlers
    setupWindowEventHandlers(mainWindow);

    // Load the appropriate content
    loadWindowContent(mainWindow);

    return mainWindow;
}

/**
 * Set up event handlers for the window
 */
function setupWindowEventHandlers(window: BrowserWindow): void {
    // Test active push message to Renderer-process
    window.webContents.on('did-finish-load', () => {
        window.webContents.send('main-process-message', new Date().toLocaleString());
    });

    // Show window when DOM is ready
    window.webContents.on('dom-ready', () => {
        window.show();
    });

    // Show window when ready to prevent visual flash
    window.once('ready-to-show', () => {
        window.show();
    });

    // Optional: Open DevTools in development
    // window.webContents.openDevTools();
}

/**
 * Load the appropriate content based on environment
 */
function loadWindowContent(window: BrowserWindow): void {
    const paths = getPaths();

    if (paths.VITE_DEV_SERVER_URL) {
        window.loadURL(paths.VITE_DEV_SERVER_URL);
    } else {
        window.loadFile(path.join(paths.RENDERER_DIST, 'index.html'));
    }
}

/**
 * Get the current main window instance
 */
export function getMainWindow(): BrowserWindow | null {
    return mainWindow;
}

/**
 * Close the main window and set reference to null
 */
export function closeMainWindow(): void {
    if (mainWindow) {
        mainWindow.close();
        mainWindow = null;
    }
}

/**
 * Check if any windows are open
 */
export function hasOpenWindows(): boolean {
    return BrowserWindow.getAllWindows().length > 0;
}

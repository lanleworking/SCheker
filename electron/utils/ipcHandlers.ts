import { ipcMain, dialog, BrowserWindow } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { systemInfoCollector } from '../../src/utils/systemInfo';
import { exportToJSON, exportToExcel, exportToPDF, exportToWordWithDeviceInfo } from './exportUtils';

/**
 * Register all IPC handlers for system information
 */
export function registerSystemInfoHandlers(): void {
    // System information handlers
    ipcMain.handle('get-system-info', async () => {
        try {
            const result = await systemInfoCollector.getAllSystemInfo();
            return result;
        } catch (error) {
            console.error('Error getting system info:', error);
            throw error;
        }
    });

    ipcMain.handle('get-cpu-info', async () => {
        try {
            return await systemInfoCollector.getCPUInfo();
        } catch (error) {
            console.error('Error getting CPU info:', error);
            throw error;
        }
    });

    ipcMain.handle('get-memory-info', async () => {
        try {
            return await systemInfoCollector.getMemoryInfo();
        } catch (error) {
            console.error('Error getting memory info:', error);
            throw error;
        }
    });

    ipcMain.handle('get-storage-info', async () => {
        try {
            return await systemInfoCollector.getStorageInfo();
        } catch (error) {
            console.error('Error getting storage info:', error);
            throw error;
        }
    });

    ipcMain.handle('get-gpu-info', async () => {
        try {
            return await systemInfoCollector.getGPUInfo();
        } catch (error) {
            console.error('Error getting GPU info:', error);
            throw error;
        }
    });

    ipcMain.handle('get-os-info', async () => {
        try {
            return await systemInfoCollector.getOSInfo();
        } catch (error) {
            console.error('Error getting OS info:', error);
            throw error;
        }
    });

    ipcMain.handle('get-network-info', async () => {
        try {
            return await systemInfoCollector.getNetworkInfo();
        } catch (error) {
            console.error('Error getting network info:', error);
            throw error;
        }
    });

    // Additional detailed information handlers
    ipcMain.handle('get-bios-info', async () => {
        try {
            return await systemInfoCollector.getBIOSInfo();
        } catch (error) {
            console.error('Error getting BIOS info:', error);
            throw error;
        }
    });

    ipcMain.handle('get-baseboard-info', async () => {
        try {
            return await systemInfoCollector.getBaseboardInfo();
        } catch (error) {
            console.error('Error getting baseboard info:', error);
            throw error;
        }
    });

    ipcMain.handle('get-chassis-info', async () => {
        try {
            return await systemInfoCollector.getChassisInfo();
        } catch (error) {
            console.error('Error getting chassis info:', error);
            throw error;
        }
    });

    ipcMain.handle('get-battery-info', async () => {
        try {
            return await systemInfoCollector.getBatteryInfo();
        } catch (error) {
            console.error('Error getting battery info:', error);
            throw error;
        }
    });

    ipcMain.handle('get-audio-info', async () => {
        try {
            return await systemInfoCollector.getAudioInfo();
        } catch (error) {
            console.error('Error getting audio info:', error);
            throw error;
        }
    });

    ipcMain.handle('get-usb-info', async () => {
        try {
            return await systemInfoCollector.getUSBInfo();
        } catch (error) {
            console.error('Error getting USB info:', error);
            throw error;
        }
    });
}

/**
 * Register all IPC handlers for export functionality
 */
export function registerExportHandlers(): void {
    // File path selection handler
    ipcMain.handle('select-save-path', async () => {
        try {
            const win = BrowserWindow.getFocusedWindow();
            if (!win) {
                throw new Error('No focused window available');
            }

            const result = await dialog.showOpenDialog(win, {
                title: 'Select Save Location',
                defaultPath: os.homedir(),
                properties: ['openDirectory'],
            });

            if (result.canceled || !result.filePaths.length) {
                return null;
            }

            return result.filePaths[0];
        } catch (error) {
            console.error('Error selecting save path:', error);
            throw error;
        }
    });

    // Export data handler
    ipcMain.handle('export-data', async (event, data, filename, fileType, savePath) => {
        try {
            // Ensure the directory exists
            if (!fs.existsSync(savePath)) {
                await fs.promises.mkdir(savePath, { recursive: true });
            }

            const extension = fileType === 'excel' ? 'xlsx' : fileType === 'word' ? 'docx' : fileType;
            const fullPath = path.join(savePath, `${filename}.${extension}`);

            console.log('Exporting to:', fullPath);

            switch (fileType) {
                case 'json':
                    await exportToJSON(data, fullPath);
                    break;
                case 'excel':
                    await exportToExcel(data, fullPath);
                    break;
                case 'pdf':
                    await exportToPDF(data, fullPath);
                    break;
                case 'word':
                    await exportToWordWithDeviceInfo(data, fullPath);
                    break;
                default:
                    throw new Error(`Unsupported file type: ${fileType}`);
            }

            return true;
        } catch (error) {
            console.error('Error exporting data:', error);
            throw error;
        }
    });
}

/**
 * Register all IPC handlers
 */
export function registerAllIpcHandlers(): void {
    registerSystemInfoHandlers();
    registerExportHandlers();
}

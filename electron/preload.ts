const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script is executing...');

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
    on(channel: string, listener: any) {
        return ipcRenderer.on(channel, (event: any, ...args: any[]) => listener(event, ...args));
    },
    off(channel: string, listener: any) {
        return ipcRenderer.off(channel, listener);
    },
    send(channel: string, ...args: any[]) {
        return ipcRenderer.send(channel, ...args);
    },
    invoke(channel: string, ...args: any[]) {
        return ipcRenderer.invoke(channel, ...args);
    },
});

// --------- Expose system info API to the Renderer process ---------
contextBridge.exposeInMainWorld('electronAPI', {
    getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
    getCPUInfo: () => ipcRenderer.invoke('get-cpu-info'),
    getMemoryInfo: () => ipcRenderer.invoke('get-memory-info'),
    getStorageInfo: () => ipcRenderer.invoke('get-storage-info'),
    getGPUInfo: () => ipcRenderer.invoke('get-gpu-info'),
    getSystemDetails: () => ipcRenderer.invoke('get-system-details'),
    getBIOSInfo: () => ipcRenderer.invoke('get-bios-info'),
    getBaseboardInfo: () => ipcRenderer.invoke('get-baseboard-info'),
    getChassisInfo: () => ipcRenderer.invoke('get-chassis-info'),
    getOSInfo: () => ipcRenderer.invoke('get-os-info'),
    getNetworkInfo: () => ipcRenderer.invoke('get-network-info'),
    getBatteryInfo: () => ipcRenderer.invoke('get-battery-info'),
    getAudioInfo: () => ipcRenderer.invoke('get-audio-info'),
    getUSBInfo: () => ipcRenderer.invoke('get-usb-info'),
    // Export functionality
    selectSavePath: () => ipcRenderer.invoke('select-save-path'),
    exportData: (data: any, filename: string, fileType: string, savePath: string) =>
        ipcRenderer.invoke('export-data', data, filename, fileType, savePath),
    // Auto-updater functionality
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
    downloadUpdate: () => ipcRenderer.invoke('download-update'),
    installUpdate: () => ipcRenderer.invoke('install-update'),
    startPeriodicUpdates: (intervalMinutes?: number) => ipcRenderer.invoke('start-periodic-updates', intervalMinutes),
    stopPeriodicUpdates: () => ipcRenderer.invoke('stop-periodic-updates'),
    // Listen for update events
    onUpdateStatus: (callback: (status: any) => void) => ipcRenderer.on('update-status', callback),
    removeUpdateStatusListener: (callback: (status: any) => void) =>
        ipcRenderer.removeListener('update-status', callback),
    // App control
    quitApp: () => ipcRenderer.invoke('quit-app'),
});

console.log('Preload script finished executing');

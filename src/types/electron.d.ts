import type { SystemInfo } from './utils/systemInfo';

export interface UpdateStatus {
    event:
        | 'update-available'
        | 'update-not-available'
        | 'update-downloaded'
        | 'download-progress'
        | 'update-error'
        | 'download-cancelled';
    data?: {
        version?: string;
        releaseName?: string;
        releaseNotes?: string;
        releaseDate?: string;
        percent?: number;
        error?: string;
        bytesPerSecond?: number;
        transferred?: number;
        total?: number;
        speed?: string;
        downloadedSize?: string;
        totalSize?: string;
    };
}

export interface IElectronAPI {
    getSystemInfo: () => Promise<SystemInfo>;
    getCPUInfo: () => Promise<SystemInfo['cpu']>;
    getMemoryInfo: () => Promise<SystemInfo['memory']>;
    getStorageInfo: () => Promise<SystemInfo['storage']>;
    getGPUInfo: () => Promise<SystemInfo['gpu']>;
    getSystemDetails: () => Promise<SystemInfo['system']>;
    getBIOSInfo: () => Promise<SystemInfo['bios']>;
    getBaseboardInfo: () => Promise<SystemInfo['baseboard']>;
    getChassisInfo: () => Promise<SystemInfo['chassis']>;
    getOSInfo: () => Promise<SystemInfo['os']>;
    getNetworkInfo: () => Promise<SystemInfo['network']>;
    getBatteryInfo: () => Promise<SystemInfo['battery']>;
    getAudioInfo: () => Promise<SystemInfo['audio']>;
    getUSBInfo: () => Promise<SystemInfo['usb']>;
    // Export functionality
    selectSavePath: () => Promise<string | null>;
    exportData: (data: any, filename: string, fileType: string, savePath: string) => Promise<boolean>;
    // Auto-updater functionality
    getAppVersion: () => Promise<string>;
    checkForUpdates: () => Promise<boolean>;
    downloadUpdate: () => Promise<boolean>;
    installUpdate: () => Promise<boolean>;
    startPeriodicUpdates: (intervalMinutes?: number) => Promise<boolean>;
    stopPeriodicUpdates: () => Promise<boolean>;
    onUpdateStatus: (callback: (event: Electron.IpcRendererEvent, status: UpdateStatus) => void) => void;
    removeUpdateStatusListener: (callback: (event: Electron.IpcRendererEvent, status: UpdateStatus) => void) => void;
    cancelDownload: () => Promise<boolean>;
    // Network connectivity
    checkInternetConnection: () => Promise<boolean>;
    checkNetworkAvailable: () => Promise<boolean>;
    // App control
    quitApp: () => Promise<void>;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
        ipcRenderer: {
            on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
            off: (channel: string, listener?: (...args: any[]) => void) => void;
            send: (channel: string, ...args: any[]) => void;
            invoke: (channel: string, ...args: any[]) => Promise<any>;
        };
    }
}

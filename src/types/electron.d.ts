import type { SystemInfo } from './utils/systemInfo';

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

import { autoUpdater } from 'electron-updater';
import { dialog, BrowserWindow, app } from 'electron';
import log from 'electron-log';

export class AutoUpdater {
    private mainWindow: BrowserWindow | null = null;
    private updateCheckInterval: NodeJS.Timeout | null = null;
    private isDownloading: boolean = false;
    private downloadCancelled: boolean = false;

    constructor() {
        this.setupLogger();
        this.configureAutoUpdater();
        this.setupEventHandlers();
    }

    private setupLogger() {
        // Configure electron-log for auto-updater
        autoUpdater.logger = log;
        log.transports.file.level = 'info';
        log.info('Auto-updater initialized');
    }

    private configureAutoUpdater() {
        // Configure auto-updater settings
        autoUpdater.checkForUpdatesAndNotify();
        autoUpdater.autoDownload = false;
        autoUpdater.autoInstallOnAppQuit = true;
        autoUpdater.forceDevUpdateConfig = true;

        // Set update server URL (replace with your actual update server)
        autoUpdater.setFeedURL({
            provider: 'github',
            owner: 'lanleworking',
            repo: 'SCheker',
            private: false,
        });
    }

    private setupEventHandlers() {
        // Update available
        autoUpdater.on('update-available', (info) => {
            log.info('Update available:', info);
            this.sendUpdateStatus('update-available', {
                version: info.version,
                releaseDate: info.releaseDate,
                releaseNotes: info.releaseNotes,
            });
        });

        // Update not available
        autoUpdater.on('update-not-available', (info) => {
            // log.info('Update not available:', info);
            this.sendUpdateStatus('update-not-available');
        });

        // Update error
        autoUpdater.on('error', (err) => {
            log.error('Update error:', err);
            this.sendUpdateStatus('update-error', { error: err.message });
        });

        // Download progress
        autoUpdater.on('download-progress', (progressObj) => {
            // If download was cancelled, don't send progress updates
            if (this.downloadCancelled) {
                return;
            }

            const logMessage = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total})`;
            log.info(logMessage);

            this.sendUpdateStatus('download-progress', {
                percent: Math.round(progressObj.percent),
                bytesPerSecond: progressObj.bytesPerSecond,
                transferred: progressObj.transferred,
                total: progressObj.total,
                speed: this.formatBytes(progressObj.bytesPerSecond || 0) + '/s',
                downloadedSize: this.formatBytes(progressObj.transferred || 0),
                totalSize: this.formatBytes(progressObj.total || 0),
            });
        });

        // Update downloaded
        autoUpdater.on('update-downloaded', (info) => {
            // If download was cancelled, don't proceed with installation
            if (this.downloadCancelled) {
                this.downloadCancelled = false;
                this.isDownloading = false;
                return;
            }

            this.isDownloading = false;
            this.sendUpdateStatus('update-downloaded', {
                version: info.version,
                releaseDate: info.releaseDate,
            });

            // Show update dialog
            this.showUpdateDialog(info);
        });

        // Update error
        autoUpdater.on('error', (err) => {
            this.isDownloading = false;
            this.downloadCancelled = false;
            log.error('Update error:', err);
            this.sendUpdateStatus('update-error', { error: err.message });
        });
    }

    private formatBytes(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    private sendUpdateStatus(event: string, data?: any) {
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
            this.mainWindow.webContents.send('update-status', { event, data });
        }
    }

    private async showUpdateDialog(info: any) {
        const result = await dialog.showMessageBox({
            type: 'info',
            title: 'Update Available',
            message: `Version ${info.version} has been downloaded.`,
            detail: 'The application will restart to apply the update.',
            buttons: ['Restart Now', 'Later'],
            defaultId: 0,
            cancelId: 1,
        });

        if (result.response === 0) {
            autoUpdater.quitAndInstall();
        }
    }

    public setMainWindow(window: BrowserWindow) {
        this.mainWindow = window;
    }

    public async checkForUpdates(): Promise<void> {
        try {
            log.info('Checking for updates...');
            await autoUpdater.checkForUpdatesAndNotify();
        } catch (error: any) {
            const errorMessage = error?.message || 'Unknown error occurred';
            // log.error('Failed to check for updates:', errorMessage);
            this.sendUpdateStatus('update-error', { error: errorMessage });
        }
    }

    public startPeriodicUpdateCheck(intervalMinutes: number = 60) {
        // Check for updates every hour by default
        this.updateCheckInterval = setInterval(() => {
            this.checkForUpdates();
        }, intervalMinutes * 60 * 1000);

        log.info(`Periodic update check started (every ${intervalMinutes} minutes)`);
    }

    public stopPeriodicUpdateCheck() {
        if (this.updateCheckInterval) {
            clearInterval(this.updateCheckInterval);
            this.updateCheckInterval = null;
            log.info('Periodic update check stopped');
        }
    }

    public async downloadUpdate(): Promise<void> {
        try {
            this.isDownloading = true;
            this.downloadCancelled = false;
            await autoUpdater.downloadUpdate();
        } catch (error) {
            this.isDownloading = false;
            this.downloadCancelled = false;
            log.error('Failed to download update:', error);
            throw error;
        }
    }

    public quitAndInstall(): void {
        autoUpdater.quitAndInstall();
    }
}

// Export singleton instance
export const appUpdater = new AutoUpdater();
